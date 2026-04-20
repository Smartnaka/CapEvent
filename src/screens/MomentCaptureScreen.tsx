import React, { useEffect, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveMoment } from '../storage/localDb';
import { Moment } from '../types/moment';
import { TagChip } from '../components/TagChip';
import { Button } from '../components/Button';
import { Colors, Radius, Shadow, Spacing, Typography } from '../design/tokens';

const TAG_OPTIONS = ['Networking', 'Keynote', 'Booth', 'Action Item', 'Idea', 'Speaker', 'Workshop'];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function useScreenEntrance(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 180 }));
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
  const [inputFocused, setInputFocused] = useState(false);

  const isSaveDisabled = text.trim().length === 0;

  const headerAnim = useScreenEntrance(0);
  const inputAnim = useScreenEntrance(60);
  const voiceAnim = useScreenEntrance(120);
  const photoAnim = useScreenEntrance(160);
  const tagsAnim = useScreenEntrance(200);

  // Focus glow animation
  const glowOpacity = useSharedValue(0);
  const focusGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleFocus = () => {
    setInputFocused(true);
    glowOpacity.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setInputFocused(false);
    glowOpacity.value = withTiming(0, { duration: 200 });
  };

  // Voice button animation
  const micScale = useSharedValue(1);
  const micPulse = useSharedValue(1);

  useEffect(() => {
    if (voiceState === 'recording') {
      micPulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        false,
      );
    } else {
      micPulse.value = withTiming(1, { duration: 300 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState]);

  const micAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const micPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micPulse.value }],
    opacity: voiceState === 'recording' ? (micPulse.value - 1) * -3.33 + 0.4 : 0,
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

  const onSaveMoment = async () => {
    const moment: Moment = {
      id: `${Date.now()}`,
      type: photoUri ? 'photo' : voiceState === 'recording' ? 'voice' : 'text',
      content: text.trim(),
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    };

    await saveMoment(moment);
    setText('');
    setSelectedTags([]);
    setVoiceState('idle');
    setPhotoUri('');
    Alert.alert('Saved ✓', 'Moment captured and stored.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.title}>Capture Moment</Text>
          <Text style={styles.subtitle}>Document your event memories with text, voice, or photos</Text>
        </Animated.View>

        {/* Text Input */}
        <Animated.View style={inputAnim}>
          <Animated.View style={[styles.inputGlow, focusGlowStyle]} />
          <View style={[styles.inputWrap, inputFocused && styles.inputFocused]}>
            <TextInput
              placeholder="What's happening right now…"
              placeholderTextColor={Colors.secondaryText}
              value={text}
              onChangeText={setText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={styles.input}
              multiline
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* Voice Button */}
        <Animated.View style={[styles.voiceRow, voiceAnim]}>
          <Text style={styles.sectionLabel}>Voice Note</Text>
          <View style={styles.micWrapper}>
            <Animated.View style={[styles.micPulseRing, micPulseStyle]} />
            <AnimatedPressable
              style={[
                styles.micButton,
                voiceState === 'recording' && styles.micButtonActive,
                micAnimStyle,
                Shadow.soft,
              ]}
              onPress={() => setVoiceState((v) => (v === 'recording' ? 'idle' : 'recording'))}
              onPressIn={handleMicPressIn}
              onPressOut={handleMicPressOut}
            >
              <Text style={styles.micIcon}>{voiceState === 'recording' ? '■' : '🎤'}</Text>
            </AnimatedPressable>
          </View>
          <Text style={styles.voiceStatus}>
            {voiceState === 'recording' ? 'Recording… tap to stop' : 'Tap to record'}
          </Text>
        </Animated.View>

        {/* Photo Picker */}
        <Animated.View style={[styles.photoSection, photoAnim]}>
          <Text style={styles.sectionLabel}>Photo</Text>
          <View style={styles.photoTile}>
            {photoUri ? (
              <>
                <Text style={styles.photoPreview} numberOfLines={1}>📷 {photoUri}</Text>
                <Pressable onPress={() => setPhotoUri('')}>
                  <Text style={styles.photoRemove}>Remove</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={styles.photoAdd}
                onPress={() => setPhotoUri('photo_' + Date.now())}
              >
                <Text style={styles.photoAddIcon}>＋</Text>
                <Text style={styles.photoAddLabel}>Add Photo</Text>
              </Pressable>
            )}
          </View>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    gap: 4,
  },
  title: {
    ...Typography.title,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: 14,
  },
  inputGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: Radius.xl + 4,
    backgroundColor: Colors.primary,
    opacity: 0.08,
    zIndex: 0,
  },
  inputWrap: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    minHeight: 160,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.soft,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  input: {
    ...Typography.body,
    flex: 1,
    minHeight: 130,
    color: Colors.text,
    fontSize: 17,
    lineHeight: 26,
  },
  sectionLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  voiceRow: {
    gap: 0,
  },
  micWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
  },
  micPulseRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.destructive,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  micButtonActive: {
    backgroundColor: Colors.destructiveLight,
    borderColor: Colors.destructive,
  },
  micIcon: {
    fontSize: 26,
  },
  voiceStatus: {
    ...Typography.small,
    textAlign: 'center',
    marginTop: 8,
  },
  photoSection: {
    gap: 0,
  },
  photoTile: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: 8,
  },
  photoAdd: {
    alignItems: 'center',
    gap: 6,
  },
  photoAddIcon: {
    fontSize: 28,
    color: Colors.secondaryText,
    lineHeight: 32,
  },
  photoAddLabel: {
    ...Typography.caption,
    fontWeight: '500',
  },
  photoPreview: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.text,
  },
  photoRemove: {
    ...Typography.caption,
    color: Colors.destructive,
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
