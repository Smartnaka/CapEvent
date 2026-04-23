import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Typography } from '@/src/design/tokens';

const UPCOMING_EVENTS = [
  { title: 'Marketing Summit 2025', date: 'May 24 - 25, 2025', place: 'San Francisco, CA', color: '#7EB4F7' },
  { title: "Lisa's Birthday Bash", date: 'May 30, 2025', place: 'Brooklyn, NY', color: '#E8A6D8' },
  { title: 'Tech Innovators Meetup', date: 'June 5, 2025', place: 'Austin, TX', color: '#8CA9FF' },
];

const QUICK_ACCESS = [
  { label: 'Capture\nMoment', icon: 'camera', color: '#A67CE8' },
  { label: 'My Events', icon: 'calendar', color: '#84C797' },
  { label: 'Timeline', icon: 'file-text', color: '#F3A165' },
  { label: 'Insights', icon: 'bar-chart-2', color: '#74A9EA' },
] as const;

export function HomeDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <Text style={styles.logo}>🍋</Text>
          <Text style={styles.brand}>CapEvent <Text style={styles.brandAccent}>AI</Text></Text>
          <Feather name="bell" size={20} color={Colors.textMuted} />
        </View>

        <Text style={styles.greeting}>Good morning, Emma! 👋</Text>
        <Text style={styles.subtext}>Ready to capture your{`\n`}next big memory?</Text>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {UPCOMING_EVENTS.map((event) => (
          <View key={event.title} style={styles.eventCard}>
            <View style={[styles.thumb, { backgroundColor: event.color }]} />
            <View style={styles.eventMeta}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventSub}>{event.date}</Text>
              <Text style={styles.eventSub}>📍 {event.place}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACCESS.map((item) => (
            <View key={item.label} style={[styles.quickCard, { backgroundColor: item.color }]}>
              <Feather name={item.icon} color="#fff" size={19} />
              <Text style={styles.quickLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  logo: { fontSize: 30, marginRight: 8 },
  brand: { ...Typography.heading, flex: 1, fontSize: 34, fontWeight: '800' },
  brandAccent: { color: Colors.accent },
  greeting: { ...Typography.title, fontSize: 38, marginBottom: 6 },
  subtext: { ...Typography.body, color: Colors.textMuted, marginBottom: 16, lineHeight: 27 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { ...Typography.label, color: Colors.text, fontSize: 18, marginBottom: 10 },
  seeAll: { ...Typography.label, color: Colors.accent, fontSize: 14 },
  eventCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    ...Shadow.soft,
  },
  thumb: { width: 62, height: 62, borderRadius: Radius.lg },
  eventMeta: { flex: 1 },
  eventTitle: { ...Typography.subheadline, color: Colors.text, fontSize: 17, marginBottom: 2 },
  eventSub: { ...Typography.caption, color: Colors.textMuted, fontSize: 13 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickCard: {
    flex: 1,
    borderRadius: Radius.xl,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 102,
  },
  quickLabel: { color: '#fff', fontWeight: '700', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
