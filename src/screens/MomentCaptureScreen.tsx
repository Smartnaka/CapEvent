import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { TagChip } from '@/src/components/TagChip';
import { Button } from '@/src/components/Button';
import { saveMoment } from '@/src/storage/localDb';

const TAGS = ['Idea', 'Contact', 'Insight', 'Task'] as const;

export function MomentCaptureScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Empty moment', 'Please enter some text before saving.');
      return;
    }
    setIsSaving(true);
    try {
      await saveMoment({
        type: 'text',
        content: content.trim(),
        tags: selectedTags,
        createdAt: new Date().toISOString(),
      });
      setContent('');
      setSelectedTags([]);
      router.navigate('/(tabs)');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVoice = async () => {
    if (isRecording && recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        if (uri) {
          setIsSaving(true);
          try {
            await saveMoment({
              type: 'voice',
              content: 'Voice recording',
              tags: selectedTags,
              createdAt: new Date().toISOString(),
              mediaUri: uri,
            });
            setSelectedTags([]);
            router.navigate('/(tabs)');
          } finally {
            setIsSaving(false);
          }
        }
      } catch {
        Alert.alert('Error', 'Failed to stop recording.');
      }
      return;
    }

    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Microphone access is needed to record voice moments.');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(rec);
      setIsRecording(true);
    } catch {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const handlePhoto = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Photo library access is needed to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsSaving(true);
      try {
        await saveMoment({
          type: 'photo',
          content: 'Photo captured',
          tags: selectedTags,
          createdAt: new Date().toISOString(),
          mediaUri: result.assets[0].uri,
        });
        setSelectedTags([]);
        router.navigate('/(tabs)');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Capture Moment</Text>
          <Text style={styles.subtitle}>Log what's happening right now.</Text>
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="What happened? What did you observe?"
          placeholderTextColor={Colors.textFaint}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* Media Buttons */}
        <View style={styles.mediaRow}>
          <Pressable
            style={[styles.mediaButton, isRecording && styles.mediaButtonActive]}
            onPress={() => { void handleVoice(); }}
            disabled={isSaving}
          >
            <Feather
              name={isRecording ? 'mic-off' : 'mic'}
              size={20}
              color={isRecording ? Colors.accent : Colors.textMuted}
            />
            <Text style={[styles.mediaLabel, isRecording && styles.mediaLabelActive]}>
              {isRecording ? 'Stop' : 'Voice'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.mediaButton}
            onPress={() => { void handlePhoto(); }}
            disabled={isSaving}
          >
            <Feather name="camera" size={20} color={Colors.textMuted} />
            <Text style={styles.mediaLabel}>Photo</Text>
          </Pressable>
        </View>

        {/* Tag Selector */}
        <View style={styles.tagSection}>
          <Text style={styles.tagLabel}>Tags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagRow}
          >
            {TAGS.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Save Button */}
        <Button
          label={isSaving ? 'Saving…' : 'Save Moment'}
          onPress={() => { void handleSave(); }}
          disabled={isSaving || !content.trim()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    gap: 4,
  },
  title: {
    ...Typography.largeTitle,
  },
  subtitle: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.text,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  mediaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
  },
  mediaButtonActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.tintedBackground,
  },
  mediaLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  mediaLabelActive: {
    color: Colors.accent,
  },
  tagSection: {
    gap: Spacing.sm,
  },
  tagLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
