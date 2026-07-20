import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type StatItem = {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  label: string;
  color: string;
};

type StatsRowProps = {
  active: number;
  completed: number;
  pending: number;
  highRisk: number;
};

export default function StatsRow({ active, completed, pending, highRisk }: StatsRowProps) {
  const items: StatItem[] = [
    { icon: 'briefcase-outline', count: active, label: 'Active\nSurveys', color: AppColors.primaryLight },
    { icon: 'checkmark-circle-outline', count: completed, label: 'Completed\nSurveys', color: AppColors.success },
    { icon: 'time-outline', count: pending, label: 'Pending\nSurveys', color: AppColors.secondary },
    { icon: 'warning-outline', count: highRisk, label: 'High Risk\nSurveys', color: AppColors.danger },
  ];

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.statItem}>
          <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>
          <Text style={[styles.countText, { color: item.color }]}>{item.count}</Text>
          <Text style={styles.labelText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    ...AppShadows.md,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  countText: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.gray500,
    textAlign: 'center',
    lineHeight: 15,
  },
});
