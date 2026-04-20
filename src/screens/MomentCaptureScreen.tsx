import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { saveMoment } from '../storage/localDb';
import { Moment } from '../types/moment';
import { MAX_CONTENT_LENGTH } from '../utils/validation';
import { TagChip } from '../components/TagChip';
import { Button } from '../components/Button';
import { Colors, Gradients, Radius, Shadow, Spacing, Typography } from '../design/tokens';

const TAG_OPTIONS = ['Networking', 'Keynote', 'Booth', 'Action Item', 'Idea', 'Speaker', 'Workshop'];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function useScreenEntrance(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 180 }));
    // delay is a mount-time constant — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export function MomentCaptureScreen() {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [voiceState, setVoiceState] = useState<'idle' | 'recording'>('idle');
  const [photoUri, setPhotoUri] = useState('');
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const isSaveDisabled = text.trim().length === 0;

  const headerAnim = useScreenEntrance(0);
  const inputAnim = useScreenEntrance(60);
  const voiceAnim = useScreenEntrance(120);
  const photoAnim = useScreenEntrance(160);
  const tagsAnim = useScreenEntrance(200);

  // Focus glow animation
  const glowOpacity = useSharedValue(0);
  const borderGlow = useSharedValue(0);
  const focusGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));
  const borderStyle = useAnimatedStyle(() => ({
    borderColor: borderGlow.value === 1 ? Colors.borderGlow : Colors.border,
  }));

  const handleFocus = () => {
    glowOpacity.value = withTiming(1, { duration: 200 });
    borderGlow.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    glowOpacity.value = withTiming(0, { duration: 200 });
    borderGlow.value = withTiming(0, { duration: 200 });
  };

  // Voice button animation
  const micScale = useSharedValue(1);
  const micPulse = useSharedValue(1);

  useEffect(() => {
    if (voiceState === 'recording') {
      micPulse.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        false,
      );
    } else {
      micPulse.value = withTiming(1, { duration: 300 });
    }
    // micPulse is a Reanimated shared value — stable reference, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState]);

  const micAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const micPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micPulse.value }],
    opacity: voiceState === 'recording' ? (micPulse.value - 1) * -3.33 + 0.35 : 0,
  }));

  const handleMicPressIn = () => {
    micScale.value = withSpring(0.92, { damping: 15, stiffness: 350 });
  };

  const handleMicPressOut = () => {
    micScale.value = withSpring(1, { damping: 15, stiffness: 350 });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((entry) => entry !== tag)
        : [...current, tag],
    );
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Microphone access is needed to record voice notes.');
        return;
      }
      setPhotoUri('');
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setVoiceState('recording');
    } catch (err) {
      console.error('startRecording failed:', err);
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    const recording = recordingRef.current;
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      recordingRef.current = null;
      setRecordingUri(uri ?? null);
      setVoiceState('idle');
    } catch (err) {
      console.error('stopRecording failed:', err);
      Alert.alert('Error', 'Could not stop recording. Please try again.');
    }
  };

  const handleMicToggle = async () => {
    if (voiceState === 'recording') {
      await stopRecording();
    } else {
      setRecordingUri(null);
      await startRecording();
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library access is needed to attach photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setRecordingUri(null);
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onSaveMoment = async () => {
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_CONTENT_LENGTH) {
      Alert.alert('Invalid input', `Content must be between 1 and ${MAX_CONTENT_LENGTH} characters.`);
      return;
    }

    const moment: Omit<Moment, 'id'> = {
      type: photoUri ? 'photo' : recordingUri ? 'voice' : 'text',
      content: trimmed,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
      mediaUri: photoUri || recordingUri || undefined,
    };

    try {
      await saveMoment(moment);
      setText('');
      setSelectedTags([]);
      setVoiceState('idle');
      setPhotoUri('');
      setRecordingUri(null);
      Alert.alert('Saved ✓', 'Moment captured and stored.');
    } catch (err) {
      console.error('saveMoment failed:', err);
      Alert.alert('Error', 'Failed to save moment. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Ambient glow */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.eyebrow}>✦  New Entry</Text>
          <Text style={styles.title}>Capture Moment</Text>
          <Text style={styles.subtitle}>Document your event memories with text, voice, or photos</Text>
        </Animated.View>

        {/* Text Input */}
        <Animated.View style={inputAnim}>
          <Animated.View style={[styles.inputGlow, focusGlowStyle]} />
          <Animated.View style={[styles.inputWrap, borderStyle]}>
            <TextInput
              placeholder="What's happening right now…"
              placeholderTextColor={Colors.mutedText}
              value={text}
              onChangeText={setText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={styles.input}
              multiline
              textAlignVertical="top"
              maxLength={MAX_CONTENT_LENGTH}
            />
            <Text style={styles.charCount}>{text.length}/{MAX_CONTENT_LENGTH}</Text>
          </Animated.View>
        </Animated.View>

        {/* Media Row — Voice + Photo */}
        <Animated.View style={[styles.mediaRow, voiceAnim]}>
          {/* Voice Button */}
          <View style={styles.mediaCard}>
            <Text style={styles.sectionLabel}>Voice Note</Text>
            <View style={styles.micWrapper}>
              <Animated.View style={[styles.micPulseRing, micPulseStyle]} />
              <AnimatedPressable
                style={[
                  styles.micButtonOuter,
                  micAnimStyle,
                  Shadow.soft,
                ]}
                onPress={handleMicToggle}
                onPressIn={handleMicPressIn}
                onPressOut={handleMicPressOut}
              >
                {voiceState === 'recording' ? (
                  <View style={[styles.micButton, styles.micButtonActive]}>
                    <Text style={styles.micIconStop}>■</Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={recordingUri ? Gradients.accent : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                    style={styles.micButton}
                  >
                    <Text style={styles.micIcon}>🎙</Text>
                  </LinearGradient>
                )}
              </AnimatedPressable>
            </View>
            <Text style={styles.voiceStatus}>
              {voiceState === 'recording'
                ? '● Recording…'
                : recordingUri
                ? '✓ Saved'
                : 'Tap to record'}
            </Text>
          </View>

          {/* Photo Picker */}
          <Animated.View style={[styles.mediaCard, photoAnim]}>
            <Text style={styles.sectionLabel}>Photo</Text>
            {photoUri ? (
              <View style={styles.photoAttached}>
                <LinearGradient colors={Gradients.accent} style={styles.photoIcon}>
                  <Text style={styles.photoIconText}>📸</Text>
                </LinearGradient>
                <Pressable onPress={() => setPhotoUri('')} style={styles.photoRemoveBtn}>
                  <Text style={styles.photoRemove}>Remove</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.photoAdd} onPress={handlePickPhoto}>
                <View style={styles.photoAddCircle}>
                  <Text style={styles.photoAddIcon}>＋</Text>
                </View>
                <Text style={styles.photoAddLabel}>Add Photo</Text>
              </Pressable>
            )}
          </Animated.View>
        </Animated.View>

        {/* Tags */}
        <Animated.View style={[styles.tagsSection, tagsAnim]}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagsWrap}>
            {TAG_OPTIONS.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky Save Button */}
      <View style={[styles.saveBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label="Save Moment"
          onPress={onSaveMoment}
          disabled={isSaveDisabled}
          style={styles.saveButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  ambientGlow: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.neon,
    opacity: 0.08,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    gap: 5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    ...Typography.title,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 14,
    lineHeight: 20,
  },
  inputGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: Radius.xl + 4,
    backgroundColor: Colors.primary,
    opacity: 0.1,
    zIndex: 0,
  },
  inputWrap: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xxl,
    padding: Spacing.md,
    minHeight: 160,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.soft,
  },
  input: {
    ...Typography.body,
    flex: 1,
    minHeight: 120,
    color: Colors.text,
    fontSize: 17,
    lineHeight: 26,
  },
  charCount: {
    ...Typography.small,
    textAlign: 'right',
    marginTop: 8,
    color: Colors.mutedText,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  mediaCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xxl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    minHeight: 150,
    ...Shadow.soft,
  },
  micWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 76,
    marginBottom: 8,
  },
  micPulseRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.destructive,
  },
  micButtonOuter: {
    borderRadius: 34,
    overflow: 'hidden',
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  micButtonActive: {
    backgroundColor: Colors.destructiveLight,
    borderColor: Colors.destructive,
  },
  micIcon: {
    fontSize: 24,
  },
  micIconStop: {
    fontSize: 18,
    color: Colors.destructive,
  },
  voiceStatus: {
    fontSize: 11,
    color: Colors.mutedText,
    textAlign: 'center',
    fontWeight: '500',
  },
  photoAttached: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  photoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIconText: {
    fontSize: 22,
  },
  photoRemoveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.destructive + '40',
    backgroundColor: Colors.destructiveLight,
  },
  photoRemove: {
    fontSize: 11,
    color: Colors.destructive,
    fontWeight: '600',
  },
  photoAdd: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  photoAddCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddIcon: {
    fontSize: 22,
    color: Colors.secondaryText,
    lineHeight: 26,
  },
  photoAddLabel: {
    fontSize: 11,
    color: Colors.mutedText,
    fontWeight: '500',
  },
  tagsSection: {
    gap: 0,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  saveBar: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    width: '100%',
  },
});
