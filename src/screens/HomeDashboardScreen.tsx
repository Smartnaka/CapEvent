import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard, GlowButton } from '@/src/components/premium/PremiumPrimitives';

const suggestions = [
  'Follow up with Stripe team on analytics bundle.',
  'Create private dinner invite for AI founders.',
  'Prioritize 2 keynote takeaways into roadmap.',
];

export function HomeDashboardScreen({ onNavigateDetails }: { onNavigateDetails?: () => void }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Your AI signal from today’s event flow.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(450)}>
          <GlassCard style={styles.hero}>
            <Text style={styles.heroEyebrow}>AI Suggestions</Text>
            <Text style={styles.heroText}>14 moments captured · 3 strategic actions generated.</Text>
            <GlowButton label="Open Event Details" icon="arrow-up-right" onPress={onNavigateDetails} />
          </GlassCard>
        </Animated.View>

        <View style={styles.section}>
          {suggestions.map((item, index) => (
            <Animated.View key={item} entering={FadeInDown.delay(180 + index * 70).duration(420)}>
              <View style={styles.suggestionCard}>
                <Feather name="star" color={Colors.secondary} size={18} />
                <Text style={styles.suggestionText}>{item}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.fabWrap}>
          <GlowButton label="Quick Capture" icon="plus" />
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
