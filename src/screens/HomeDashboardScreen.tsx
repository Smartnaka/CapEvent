import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { MomentItem } from '@/src/components/MomentItem';
import { Button } from '@/src/components/Button';
import { buildDailySummary, loadMoments } from '@/src/storage/localDb';
import { Moment, DailySummary } from '@/src/types/moment';

interface HomeDashboardScreenProps {
  onNavigateDetails?: () => void;
  onQuickCapture?: () => void;
}

export function HomeDashboardScreen({ onNavigateDetails, onQuickCapture }: HomeDashboardScreenProps) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allMoments, dailySummary] = await Promise.all([
        loadMoments(),
        buildDailySummary(),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const todayMoments = allMoments
        .filter((m) => m.createdAt.slice(0, 10) === today)
        .slice(0, 5);
      setMoments(todayMoments);
      setSummary(dailySummary);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void hydrate();
    }, [hydrate]),
  );

  const dateLabel = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.date}>{dateLabel}</Text>
        </View>

        {/* Recent Moments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Moments</Text>
          {isLoading ? (
            <Text style={styles.emptyText}>Loading…</Text>
          ) : moments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No moments captured today.</Text>
              <Text style={styles.emptyHint}>Tap "Capture Moment" to start logging.</Text>
            </View>
          ) : (
            moments.map((moment) => (
              <Pressable key={moment.id} onPress={onNavigateDetails}>
                <MomentItem moment={moment} />
              </Pressable>
            ))
          )}
        </View>

        {/* Daily Summary Card */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>AI Generated</Text>
              </View>
              <Text style={styles.summaryText}>{summary.summaryText}</Text>
              {summary.actionableInsights.slice(0, 3).map((insight, i) => (
                <View key={i} style={styles.insightRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Capture Button */}
        <View style={styles.captureWrap}>
          <Button label="Capture Moment" onPress={onQuickCapture ?? (() => {})} />
        </View>
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
  date: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  emptyHint: {
    ...Typography.caption,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  summaryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.tintedBackground,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
    letterSpacing: 0.4,
  },
  summaryText: {
    ...Typography.body,
    lineHeight: 22,
  },
  insightRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  insightText: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  captureWrap: {
    marginTop: Spacing.sm,
  },
});
