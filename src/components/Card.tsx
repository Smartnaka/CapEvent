import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow } from '../design/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  tinted?: boolean;
}

export function Card({ children, style, tinted = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        tinted && styles.tinted,
        Shadow.soft,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tinted: {
    backgroundColor: Colors.tintedBackground,
  },
});
