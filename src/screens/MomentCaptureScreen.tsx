import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { saveMoment } from '../storage/localDb';
import { Moment } from '../types/moment';

const TAG_OPTIONS = ['Networking', 'Keynote', 'Booth', 'Action Item', 'Idea'];

export function MomentCaptureScreen() {
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [voiceState, setVoiceState] = useState<'idle' | 'recording'>('idle');
  const [photoUri, setPhotoUri] = useState('');

  const isSaveDisabled = useMemo(() => text.trim().length === 0, [text]);

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
    Alert.alert('Saved', 'Moment captured and stored in local database.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Moment Capture</Text>
      <Text style={styles.subtitle}>Log text, voice, and photos with tags.</Text>

      <TextInput
        placeholder="Type your moment..."
        value={text}
        onChangeText={setText}
        style={styles.input}
        multiline
      />

      <Pressable
        style={[styles.button, voiceState === 'recording' && styles.recordingButton]}
        onPress={() => setVoiceState((value) => (value === 'recording' ? 'idle' : 'recording'))}
      >
        <Text style={styles.buttonText}>
          {voiceState === 'recording' ? 'Stop Voice Recording' : 'Start Voice Recording'}
        </Text>
      </Pressable>

      <TextInput
        placeholder="Photo URL or reference (simulated upload)"
        value={photoUri}
        onChangeText={setPhotoUri}
        style={styles.input}
      />

      <View style={styles.tagsWrap}>
        {TAG_OPTIONS.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[styles.tag, active && styles.tagActive]}
            >
              <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.button, isSaveDisabled && styles.disabled]}
        disabled={isSaveDisabled}
        onPress={onSaveMoment}
      >
        <Text style={styles.buttonText}>Save Moment</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 12,
    borderRadius: 12,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6C7B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8DFEA',
    borderRadius: 10,
    padding: 12,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#206CFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#D64545',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#D8DFEA',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tagActive: {
    borderColor: '#206CFF',
    backgroundColor: '#E7F0FF',
  },
  tagText: {
    color: '#334155',
  },
  tagTextActive: {
    color: '#206CFF',
    fontWeight: '600',
  },
});
