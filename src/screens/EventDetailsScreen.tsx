import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '@/src/design/tokens';
import { GlassCard, GlowButton } from '@/src/components/premium/PremiumPrimitives';

export function EventDetailsScreen() {
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
              <Text style={styles.heroTitle}>Founder Circle Night</Text>
              <Text style={styles.heroSubtitle}>San Francisco · April 21</Text>
            </View>
          </ImageBackground>
        </Animated.View>

        <GlassCard>
          <Text style={styles.heading}>Layered Insights</Text>
          <Text style={styles.body}>Sentiment trend is high confidence positive. AI predicts 6 warm intros ready for follow-up.</Text>
          <View style={styles.stats}>
            <View style={styles.statCard}><Text style={styles.statValue}>94%</Text><Text style={styles.statLabel}>Engagement</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Action Items</Text></View>
          </View>
          <GlowButton label="Export Brief" icon="download" />
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
});
