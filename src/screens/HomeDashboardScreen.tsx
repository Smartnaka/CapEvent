import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { MomentItem } from '@/src/components/MomentItem';
import { Button } from '@/src/components/Button';
import { Moment } from '@/src/types/moment';
import { useMoments } from '@/src/hooks/useMoments';
import { useDailySummary } from '@/src/hooks/useDailySummary';

export function HomeDashboardScreen() {
  const router = useRouter();
  const { moments, isLoading: momentsLoading, error: momentsError } = useMoments({ filterToday: true, limit: 5 });
  const { summary, isLoading: summaryLoading, error: summaryError } = useDailySummary();

  const dateLabel = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const renderMoment = ({ item }: { item: Moment }) => (
    <Pressable onPress={() => router.push('/(tabs)/summary')}>
      <MomentItem moment={item} />
    </Pressable>
  );

  const ListHeader = (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>

      {/* Recent Moments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Moments</Text>
        {momentsLoading ? (
          <Text style={styles.emptyText}>Loading…</Text>
        ) : momentsError ? (
          <View style={styles.errorCard}>
            <Feather name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>Could not load moments.</Text>
          </View>
        ) : moments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No moments captured today.</Text>
            <Text style={styles.emptyHint}>Tap "Capture Moment" to start logging.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const ListFooter = (
    <View style={styles.footerContent}>
      {/* Daily Summary Card */}
      {summaryLoading ? null : summaryError ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Summary</Text>
          <View style={styles.errorCard}>
            <Feather name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>Could not generate summary.</Text>
          </View>
        </View>
      ) : summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>AI Generated</Text>
            </View>
            <Text style={styles.summaryText}>{summary.summaryText}</Text>
            {summary.actionableInsights.slice(0, 3).map((insight) => (
              <View key={insight} style={styles.insightRow}>
                <Text style={styles.bullet}>·</Text>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Capture Button */}
      <View style={styles.captureWrap}>
        <Button
          label="Capture Moment"
          onPress={() => router.push('/(tabs)/capture')}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={moments}
        keyExtractor={(item) => item.id}
        renderItem={renderMoment}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flatListContent: {
    paddingBottom: 120,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  footerContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
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
  errorCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    color: Colors.danger,
    flex: 1,
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
