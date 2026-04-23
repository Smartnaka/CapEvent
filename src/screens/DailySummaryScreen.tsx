import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';

const DAY_ONE = ['#8D6D50', '#2B5CAA', '#74584A'];
const DAY_TWO = ['#2F4D86', '#1E3D7D', '#3A2B22'];
const MINI = ['#1E3F7D', '#3E4E87', '#2A355A'];

export function DailySummaryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Feather name="chevron-left" size={22} color={Colors.textMuted} />
          <Text style={styles.title}>Marketing Summit 2025</Text>
          <Feather name="more-horizontal" size={20} color={Colors.textMuted} />
        </View>

        <View style={styles.tabRow}>
          <Text style={[styles.tab, styles.activeTab]}>Timeline</Text>
          <Text style={styles.tab}>Gallery</Text>
        </View>

        <View style={styles.dayHeader}><Text style={styles.dayTitle}>May 24, 2025</Text><Text style={styles.dayMeta}>Day 1</Text></View>
        <View style={styles.grid3}>
          {DAY_ONE.map((c, i) => <View key={i} style={[styles.tile, { backgroundColor: c }]} />)}
        </View>

        <View style={styles.dayHeader}><Text style={styles.dayTitle}>May 25, 2025</Text><Text style={styles.dayMeta}>Day 2</Text></View>
        <View style={styles.grid3}>
          {DAY_TWO.map((c, i) => <View key={i} style={[styles.tile, { backgroundColor: c }]} />)}
        </View>

        <Text style={styles.sectionTitle}>Highlights</Text>
        <Text style={styles.sectionSub}>Best moments from the event</Text>
        <View style={styles.videoCard}>
          <View style={styles.play}><Feather name="play" size={22} color="#fff" /></View>
          <View style={styles.duration}><Text style={styles.durationText}>02:15</Text></View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Memories</Text>
        <Text style={styles.sectionSub}>All captured moments</Text>
        <View style={styles.memoriesRow}>
          {MINI.map((c, i) => <View key={i} style={[styles.miniTile, { backgroundColor: c }]} />)}
          <View style={styles.plusTile}><Feather name="plus" size={24} color={Colors.accent} /></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 120 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { ...Typography.heading, fontSize: 24 },
  tabRow: { flexDirection: 'row', gap: 32, borderBottomColor: Colors.border, borderBottomWidth: 1, marginBottom: 12 },
  tab: { ...Typography.subheadline, color: Colors.textMuted, paddingBottom: 10 },
  activeTab: { color: Colors.accent, borderBottomWidth: 3, borderBottomColor: Colors.accent },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginTop: 4 },
  dayTitle: { ...Typography.subheadline, color: Colors.textMuted },
  dayMeta: { ...Typography.subheadline, color: Colors.textFaint },
  grid3: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tile: { flex: 1, aspectRatio: 1, borderRadius: Radius.lg, ...Shadow.soft },
  sectionTitle: { ...Typography.heading, marginTop: 8, fontSize: 28 },
  sectionSub: { ...Typography.caption, color: Colors.textMuted, marginBottom: 8 },
  videoCard: { height: 160, borderRadius: Radius.xl, backgroundColor: '#1F4180', alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  play: { width: 56, height: 56, borderRadius: Radius.full, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  duration: { position: 'absolute', right: 10, bottom: 10, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  durationText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  memoriesRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  miniTile: { flex: 1, aspectRatio: 1, borderRadius: Radius.lg },
  plusTile: { width: 86, aspectRatio: 1, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
});
