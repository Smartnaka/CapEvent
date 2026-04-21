import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { buildDailySummary, loadMoments } from '../storage/localDb';
import { DailySummary } from '../types/moment';
import { Button } from '../components/Button';
import { Colors, Radius, Spacing, Typography } from '../design/tokens';

export function DailySummaryScreen() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const next = await buildDailySummary();
      setSummary(next);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateSummary();
  }, [hydrateSummary]);

  const onShare = async () => {
    if (!summary) return;
    await Share.share({
      message: `CapEvent AI Daily Summary (${summary.date})\n\n${summary.summaryText}`,
    });
  };

  const onViewMoments = async () => {
    const moments = await loadMoments();
    Alert.alert('Saved Moments', `You have ${moments.length} saved moments.`);
  };

  if (isLoading || !summary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating summary…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Summary</Text>
          <Text style={styles.date}>{summary.date}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>AI Generated</Text>
          </View>
          <Text style={styles.summaryText}>{summary.summaryText}</Text>
        </View>

        {/* Key Moments */}
        {summary.keyMoments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Moments</Text>
            <View style={styles.listContainer}>
              {summary.keyMoments.map((moment, i) => (
                <View key={`moment-${i}`} style={styles.listItem}>
                  <Text style={styles.listIndex}>{i + 1}</Text>
                  <Text style={styles.listText} numberOfLines={3}>{moment}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actionable Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actionable Insights</Text>
          <View style={styles.insightsCard}>
            {summary.actionableInsights.map((insight, i) => (
              <View key={`insight-${i}`} style={styles.insightRow}>
                <Feather name="arrow-right" size={14} color={Colors.accent} style={styles.insightIcon} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="Share Summary"
            onPress={() => { void onShare(); }}
          />
          <Button
            label="View Related Moments"
            onPress={() => { void onViewMoments(); }}
            variant="ghost"
          />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textMuted,
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
    lineHeight: 24,
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
  listContainer: {
    gap: Spacing.xs,
  },
  listItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listIndex: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
    minWidth: 20,
    marginTop: 2,
  },
  listText: {
    ...Typography.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  insightsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  insightRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginTop: 3,
  },
  insightText: {
    ...Typography.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.sm,
  },
});
