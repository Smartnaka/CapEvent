import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { buildDailySummary, loadMoments } from '../storage/localDb';
import { DailySummary } from '../types/moment';

export function DailySummaryScreen() {
  const [summary, setSummary] = useState<DailySummary | null>(null);

  const hydrateSummary = useCallback(async () => {
    const next = await buildDailySummary();
    setSummary(next);
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

  const onViewDetailedMoments = async () => {
    const moments = await loadMoments();
    Alert.alert('Detailed Moments', `You have ${moments.length} saved moments.`);
  };

  if (!summary) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loading}>Generating daily summary...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Summary</Text>
      <Text style={styles.summaryText}>{summary.summaryText}</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Key Moments</Text>
        {summary.keyMoments.map((moment) => (
          <Text key={moment} style={styles.bullet}>{`• ${moment}`}</Text>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Actionable Insights</Text>
        {summary.actionableInsights.map((insight) => (
          <Text key={insight} style={styles.bullet}>{`• ${insight}`}</Text>
        ))}
      </View>

      <Pressable style={styles.button} onPress={onShare}>
        <Text style={styles.buttonText}>Share Summary</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondary]} onPress={onViewDetailedMoments}>
        <Text style={[styles.buttonText, styles.secondaryText]}>View Detailed Moments</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  loadingWrap: {
    padding: 16,
  },
  loading: {
    color: '#5F6C7B',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 23,
    color: '#1F2937',
  },
  block: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  blockTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  bullet: {
    color: '#334155',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#206CFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#E7F0FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryText: {
    color: '#206CFF',
  },
});
