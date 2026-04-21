import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard } from '@/src/components/premium/PremiumPrimitives';

const stats = [
  { label: 'Events', value: '28' },
  { label: 'Moments', value: '412' },
  { label: 'AI Briefs', value: '93' },
];

export function ProfileScreen() {
  const [checking, setChecking] = useState(false);

  const channel = Updates.channel ?? 'N/A';
  const updateId = Updates.updateId ?? 'embedded';
  const runtimeVersion = Updates.runtimeVersion ?? Constants.expoConfig?.runtimeVersion ?? 'N/A';
  const appVersion = Constants.expoConfig?.version ?? 'N/A';

  async function handleCheckForUpdate() {
    setChecking(true);
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          'Update ready',
          'A new update has been downloaded. Reload now to apply it, or continue and it will be applied on next launch.',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Reload now', onPress: () => { void Updates.reloadAsync(); } },
          ],
        );
      } else {
        Alert.alert('Up to date', 'You are already running the latest update.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert('Check failed', `Could not check for updates: ${message}`);
    } finally {
      setChecking(false);
    }
  }

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

        <GlassCard>
          <Text style={styles.sectionTitle}>App Update Status</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{appVersion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Runtime</Text>
            <Text style={styles.infoValue}>{typeof runtimeVersion === 'string' ? runtimeVersion : JSON.stringify(runtimeVersion)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Channel</Text>
            <Text style={styles.infoValue}>{channel}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Update ID</Text>
            <Text style={[styles.infoValue, styles.infoValueMono]} numberOfLines={1} ellipsizeMode="middle">
              {updateId}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.checkButton, pressed && styles.checkButtonPressed]}
            onPress={() => { void handleCheckForUpdate(); }}
            disabled={checking}
          >
            {checking ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Feather name="refresh-cw" size={15} color={Colors.primary} />
            )}
            <Text style={styles.checkButtonLabel}>{checking ? 'Checking…' : 'Check for Update'}</Text>
          </Pressable>
        </GlassCard>
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
  sectionTitle: { ...Typography.label, marginBottom: Spacing.sm, color: Colors.textMuted },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.stroke,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { ...Typography.caption, color: Colors.textMuted },
  infoValue: { ...Typography.caption, color: Colors.text, maxWidth: '60%' },
  infoValueMono: { fontVariant: ['tabular-nums'] },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.tintedBackground,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  checkButtonPressed: { opacity: 0.7 },
  checkButtonLabel: { ...Typography.label, color: Colors.primary },
});
