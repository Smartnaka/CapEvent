import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard, GlowButton } from '@/src/components/premium/PremiumPrimitives';
import { loadEvents } from '@/src/storage/localDb';
import { EventRecord } from '@/src/types/event';

interface HomeDashboardScreenProps {
  onNavigateDetails?: () => void;
  onQuickCapture?: () => void;
}

export function HomeDashboardScreen({ onNavigateDetails, onQuickCapture }: HomeDashboardScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedEvents = await loadEvents();
      setEvents(storedEvents);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void hydrateEvents();
    }, [hydrateEvents]),
  );

  const suggestions = useMemo(() => {
    if (!events.length) {
      return ['Create your first event to unlock smart follow-up suggestions.'];
    }

    const latest = events[0];
    return [
      `Follow up with guests from ${latest.name}.`,
      latest.vipContacts ? `Reach out to VIP contacts: ${latest.vipContacts}.` : 'Add VIP contacts in your next capture for better planning.',
      latest.notes ? `Convert “${latest.notes}” into next action items.` : 'Add notes to capture event outcomes and next actions.',
    ];
  }, [events]);

  const latestEvent = events[0];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Your real event pipeline, synced from device storage.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(450)}>
          <GlassCard style={styles.hero}>
            <Text style={styles.heroEyebrow}>Live Overview</Text>
            {isLoading ? (
              <Text style={styles.heroText}>Loading events…</Text>
            ) : latestEvent ? (
              <Text style={styles.heroText}>{events.length} saved events · latest: {latestEvent.name}</Text>
            ) : (
              <Text style={styles.heroText}>No events yet. Create one to start tracking insights.</Text>
            )}
            <GlowButton
              label={latestEvent ? 'Open Event Details' : 'Create First Event'}
              icon="arrow-up-right"
              onPress={latestEvent ? onNavigateDetails : onQuickCapture}
            />
          </GlassCard>
        </Animated.View>

        <View style={styles.section}>
          {suggestions.map((item, index) => (
            <Animated.View key={`${item}-${index}`} entering={FadeInDown.delay(180 + index * 70).duration(420)}>
              <View style={styles.suggestionCard}>
                <Feather name="star" color={Colors.secondary} size={18} />
                <Text style={styles.suggestionText}>{item}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.fabWrap}>
          <GlowButton label="Quick Capture" icon="plus" onPress={onQuickCapture} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 72, gap: Spacing.lg, paddingBottom: 160 },
  title: { ...Typography.title, fontSize: 34 },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 6 },
  hero: { ...Shadow.card },
  heroEyebrow: { ...Typography.label, marginBottom: 12 },
  heroText: { ...Typography.heading, marginBottom: Spacing.md, lineHeight: 30 },
  section: { gap: Spacing.md },
  suggestionCard: {
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(17,20,35,0.95)',
    borderWidth: 1,
    borderColor: Colors.stroke,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: 10,
    ...Shadow.card,
  },
  suggestionText: { ...Typography.body, flex: 1, color: Colors.text },
  fabWrap: { position: 'absolute', right: 24, bottom: 40 },
});
