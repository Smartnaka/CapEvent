import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';

const TOP_HIGHLIGHTS = ['#31528A', '#1F407B', '#2D3D74'];
const THEMES = ['Innovation', 'Leadership', 'Networking', 'AI'];

const STATS = [
  { icon: 'camera', value: '68', label: 'Memories Captured', color: '#8C69DE' },
  { icon: 'map-pin', value: '12', label: 'Key Highlights', color: '#B574E7' },
  { icon: 'users', value: '8', label: 'People Connected', color: '#8B7CE7' },
  { icon: 'heart', value: '95%', label: 'Positive Moments', color: '#54BC94' },
] as const;

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Feather name="chevron-left" size={22} color={Colors.textMuted} />
          <Text style={styles.title}>Event Insights</Text>
          <Feather name="more-horizontal" size={20} color={Colors.textMuted} />
        </View>

        <Text style={styles.eventTitle}>Marketing Summit 2025</Text>
        <Text style={styles.eventMeta}>May 24 - 25, 2025 · San Francisco, CA</Text>

        <View style={styles.recapCard}>
          <Text style={styles.recapTitle}>AI Recap ✨</Text>
          <Text style={styles.recapSub}>You had an amazing 2 days! Here's a summary of your event.</Text>

          {STATS.map((s) => (
            <View key={s.label} style={styles.statRow}>
              <Feather name={s.icon} size={16} color={s.color} />
              <View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Top Highlights</Text>
        <Text style={styles.sectionSub}>Your most memorable moments</Text>
        <View style={styles.highlightsRow}>
          {TOP_HIGHLIGHTS.map((color, i) => <View key={i} style={[styles.highlightTile, { backgroundColor: color }]} />)}
        </View>

        <Text style={styles.sectionTitle}>Key Themes</Text>
        <Text style={styles.sectionSub}>What stood out the most</Text>
        <View style={styles.themeRow}>
          {THEMES.map((theme) => (
            <View key={theme} style={styles.themePill}><Text style={styles.themeText}>{theme}</Text></View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 120 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { ...Typography.heading, fontSize: 24 },
  eventTitle: { ...Typography.heading, fontSize: 38, marginBottom: 2 },
  eventMeta: { ...Typography.subheadline, color: Colors.textMuted, marginBottom: 14 },
  recapCard: {
    backgroundColor: '#F3ECFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#E4D8FF',
    padding: 14,
    gap: 10,
    ...Shadow.soft,
  },
  recapTitle: { ...Typography.heading, fontSize: 32 },
  recapSub: { ...Typography.body, color: Colors.textMuted },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statValue: { ...Typography.heading, fontSize: 24 },
  statLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 13 },
  sectionTitle: { ...Typography.heading, marginTop: 14, fontSize: 30 },
  sectionSub: { ...Typography.caption, color: Colors.textMuted, marginBottom: 8 },
  highlightsRow: { flexDirection: 'row', gap: 8 },
  highlightTile: { flex: 1, aspectRatio: 1, borderRadius: Radius.lg },
  themeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  themePill: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 8 },
  themeText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700' },
});
