import React, { useCallback, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard, GlowButton } from '@/src/components/premium/PremiumPrimitives';
import { loadEvents } from '@/src/storage/localDb';
import { EventRecord } from '@/src/types/event';

export function EventDetailsScreen() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
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
      void hydrate();
    }, [hydrate]),
  );

  const latestEvent = events[0];

  const engagementScore = useMemo(() => {
    if (!latestEvent) {
      return 0;
    }

    const fields = [latestEvent.keyGuests, latestEvent.vipContacts, latestEvent.mood, latestEvent.notes];
    const populatedCount = fields.filter((field) => field.trim().length > 0).length;
    return 50 + populatedCount * 12;
  }, [latestEvent]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn.duration(450)}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              {isLoading ? (
                <>
                  <Text style={styles.heroTitle}>Loading latest event…</Text>
                  <Text style={styles.heroSubtitle}>Syncing from AsyncStorage</Text>
                </>
              ) : latestEvent ? (
                <>
                  <Text style={styles.heroTitle}>{latestEvent.name}</Text>
                  <Text style={styles.heroSubtitle}>{latestEvent.venue} · {new Date(latestEvent.createdAt).toLocaleDateString()}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.heroTitle}>No events available</Text>
                  <Text style={styles.heroSubtitle}>Create an event from the Create tab.</Text>
                </>
              )}
            </View>
          </ImageBackground>
        </Animated.View>

        <GlassCard>
          <Text style={styles.heading}>Stored Insights</Text>
          <Text style={styles.body}>
            {latestEvent
              ? latestEvent.notes || 'No notes added yet for this event.'
              : 'Once you publish an event, details and insights will appear here.'}
          </Text>
          <View style={styles.stats}>
            <View style={styles.statCard}><Text style={styles.statValue}>{engagementScore}%</Text><Text style={styles.statLabel}>Completeness</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>{events.length}</Text><Text style={styles.statLabel}>Saved Events</Text></View>
          </View>
          {latestEvent ? (
            <View style={styles.metaSection}>
              <Text style={styles.metaLine}>Key guests: {latestEvent.keyGuests || 'None listed'}</Text>
              <Text style={styles.metaLine}>VIP contacts: {latestEvent.vipContacts || 'None listed'}</Text>
              <Text style={styles.metaLine}>Mood: {latestEvent.mood || 'Not specified'}</Text>
            </View>
          ) : null}
          <GlowButton label="Refresh Data" icon="refresh-cw" onPress={() => { void hydrate(); }} />
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 72, gap: Spacing.lg, paddingBottom: 120 },
  hero: { height: 270, borderRadius: Radius.xl, overflow: 'hidden' },
  heroImage: { borderRadius: Radius.xl },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: Spacing.lg },
  heroTitle: { ...Typography.title },
  heroSubtitle: { ...Typography.label, marginTop: 4 },
  heading: { ...Typography.heading, marginBottom: 10 },
  body: { ...Typography.body, color: Colors.textMuted },
  stats: { flexDirection: 'row', gap: Spacing.md, marginVertical: Spacing.md },
  statCard: { flex: 1, borderRadius: Radius.lg, backgroundColor: 'rgba(20,25,40,0.85)', padding: Spacing.md, borderWidth: 1, borderColor: Colors.stroke },
  statValue: { ...Typography.title, fontSize: 26 },
  statLabel: { ...Typography.caption },
  metaSection: { gap: 6, marginBottom: Spacing.md },
  metaLine: { ...Typography.body, color: Colors.textMuted },
});
