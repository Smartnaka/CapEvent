import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';
import { Button } from '@/src/components/Button';

const MODE_TABS = ['Photo', 'Video', 'Text'];
const TAGS = ['#sunset', '#team', '#memories'];

export function MomentCaptureScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Feather name="x" size={22} color={Colors.textMuted} />
          <Text style={styles.screenTitle}>Capture Moment</Text>
          <View style={{ width: 22 }} />
        </View>

        <Text style={styles.headline}>What's the moment?</Text>
        <Text style={styles.subline}>Capture it your way.</Text>

        <View style={styles.modeRow}>
          {MODE_TABS.map((item, index) => (
            <View key={item} style={[styles.modePill, index === 0 && styles.modePillActive]}>
              <Feather name={index === 0 ? 'camera' : index === 1 ? 'video' : 'file-text'} size={14} color={index === 0 ? '#fff' : Colors.textMuted} />
              <Text style={[styles.modeText, index === 0 && styles.modeTextActive]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.previewCard}>
          <View style={styles.sparkleBadge}><Text style={styles.sparkle}>✦</Text></View>
        </View>

        <View style={styles.controlsRow}>
          <Feather name="zap" size={18} color={Colors.textMuted} />
          <View style={styles.zoomPill}><Text style={styles.zoomText}>1x</Text></View>
          <Feather name="refresh-cw" size={18} color={Colors.textMuted} />
        </View>

        <View style={styles.captureButtonOuter}><View style={styles.captureButtonInner} /></View>

        <TextInput style={styles.captionInput} placeholder="Add a caption..." placeholderTextColor={Colors.textFaint} />

        <View style={styles.tagsRow}>
          {TAGS.map((tag) => (
            <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
          ))}
        </View>

        <Button label="Save Moment ✨" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 120 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  screenTitle: { ...Typography.heading, fontSize: 24 },
  headline: { ...Typography.heading, textAlign: 'center', fontSize: 36, marginTop: 4 },
  subline: { ...Typography.body, textAlign: 'center', color: Colors.textMuted, marginBottom: 10 },
  modeRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 8 },
  modePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  modePillActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  modeText: { ...Typography.label, color: Colors.textMuted },
  modeTextActive: { color: '#fff' },
  previewCard: { height: 330, borderRadius: Radius.xl, backgroundColor: '#B69A84', ...Shadow.card, marginBottom: 8 },
  sparkleBadge: { position: 'absolute', top: 10, left: 10, width: 30, height: 30, borderRadius: Radius.full, backgroundColor: 'rgba(32,32,32,0.42)', alignItems: 'center', justifyContent: 'center' },
  sparkle: { color: '#fff', fontSize: 18 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginVertical: 6 },
  zoomPill: { backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  zoomText: { color: Colors.textMuted, fontWeight: '700' },
  captureButtonOuter: { alignSelf: 'center', width: 78, height: 78, borderRadius: Radius.full, borderWidth: 4, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  captureButtonInner: { width: 60, height: 60, borderRadius: Radius.full, backgroundColor: Colors.accent },
  captionInput: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, paddingHorizontal: 16, paddingVertical: 14, ...Typography.body },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
});
