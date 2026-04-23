import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Typography } from '../design/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.primaryLabel,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'ghost' && styles.ghostLabel,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  ghost: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...Typography.subheadline,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: Colors.accent,
  },
  ghostLabel: {
    color: Colors.textMuted,
  },
});
