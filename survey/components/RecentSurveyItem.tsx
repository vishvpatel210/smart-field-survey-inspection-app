import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type RecentSurveyItemProps = {
  siteName: string;
  clientName: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  onPress: () => void;
};

const priorityColors = {
  High: AppColors.priorityHigh,
  Medium: AppColors.priorityMedium,
  Low: AppColors.priorityLow,
};

export default function RecentSurveyItem({
  siteName,
  clientName,
  priority,
  date,
  onPress,
}: RecentSurveyItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.siteName}>{siteName}</Text>
          <Text style={styles.clientName}>{clientName}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] + '15' }]}>
          <Text style={[styles.priorityText, { color: priorityColors[priority] }]}>{priority}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="time-outline" size={14} color={AppColors.gray400} />
          <Text style={styles.date}>{date}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={AppColors.gray400} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  clientName: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 3,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: AppColors.gray400,
  },
});
