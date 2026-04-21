import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';

export function GlassCard({ style, ...props }: ViewProps) {
  return (
    <BlurView intensity={26} tint="dark" style={[styles.glassShell, style]}>
      <View {...props} style={[styles.cardInner, styles.cardGradient]} />
    </BlurView>
  );
}

export function GlowButton({ label, icon, onPress }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress?: () => void }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[anim, Shadow.glow]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        style={styles.buttonWrap}
      >
        <View style={styles.buttonGradient}>
          {icon ? <Feather name={icon} size={16} color={Colors.text} /> : null}
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function PremiumInput(props: TextInputProps) {
  return (
    <View style={styles.inputWrap}>
      <TextInput
        placeholderTextColor={Colors.textFaint}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glassShell: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.stroke,
  },
  cardGradient: {
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardInner: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  buttonWrap: {
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  buttonGradient: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...Typography.label,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  inputWrap: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.stroke,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  input: {
    ...Typography.body,
    color: Colors.text,
  },
});
