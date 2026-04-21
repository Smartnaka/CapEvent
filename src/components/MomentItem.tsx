import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../design/tokens';
import { TagChip } from './TagChip';
import { Moment } from '../types/moment';

interface MomentItemProps {
  moment: Moment;
  index?: number;
}

export function MomentItem({ moment }: MomentItemProps) {
  const formattedTime = new Date(moment.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const typeIcon = moment.type === 'voice' ? '🎤' : moment.type === 'photo' ? '📷' : '✏️';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{typeIcon}</Text>
          <Text style={styles.content} numberOfLines={2}>
            {moment.content}
          </Text>
        </View>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
      {moment.tags.length > 0 && (
        <View style={styles.tags}>
          {moment.tags.map((tag) => (
            <TagChip key={tag} label={tag} selected={true} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  icon: {
    fontSize: 16,
    marginTop: 2,
  },
  time: {
    ...Typography.small,
    flexShrink: 0,
  },
  content: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
});
