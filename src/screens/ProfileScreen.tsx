import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard } from '@/src/components/premium/PremiumPrimitives';

const stats = [
  { label: 'Events', value: '28' },
  { label: 'Moments', value: '412' },
  { label: 'AI Briefs', value: '93' },
];

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <GlassCard>
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>Avery Brooks</Text>
              <Text style={styles.role}>Event Operator · CapEvent Pro</Text>
            </View>
            <Feather name="settings" color={Colors.textMuted} size={20} />
          </View>
        </GlassCard>

        <View style={styles.grid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 72, gap: Spacing.lg, paddingBottom: 120 },
  title: { ...Typography.title, fontSize: 34 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...Typography.heading },
  role: { ...Typography.label, marginTop: 6 },
  grid: { flexDirection: 'row', gap: Spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(20,25,40,0.9)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderColor: Colors.stroke,
    borderWidth: 1,
  },
  statValue: { ...Typography.title },
  statLabel: { ...Typography.caption },
});
