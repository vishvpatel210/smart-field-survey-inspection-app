import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type SurveyCountCardProps = {
  count: number;
  label?: string;
};

export default function SurveyCountCard({ count, label = "Today's Surveys" }: SurveyCountCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="clipboard" size={24} color={AppColors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.badge}>
        <Ionicons name="trending-up" size={14} color={AppColors.success} />
        <Text style={styles.badgeText}>Active</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: AppColors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  count: {
    fontSize: 28,
    fontWeight: '800',
    color: AppColors.gray900,
  },
  label: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.success,
  },
});
