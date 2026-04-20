import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Shadow, Spacing, Typography } from '../design/tokens';
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
    <View style={[styles.card, Shadow.soft]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{typeIcon}</Text>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {moment.content}
      </Text>
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
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 18,
  },
  time: {
    ...Typography.small,
  },
  content: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});

