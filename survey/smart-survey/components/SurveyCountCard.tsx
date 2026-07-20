import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type SurveyCountCardProps = {
  count: number;
  label?: string;
};

export default function SurveyCountCard({ count, label = "Today's Surveys" }: SurveyCountCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="clipboard-outline" size={26} color={AppColors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.badge}>
        <Ionicons name="trending-up-outline" size={14} color={AppColors.success} />
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    ...AppShadows.md,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: AppColors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  count: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.gray900,
    letterSpacing: -1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray500,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.success,
  },
});
