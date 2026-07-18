import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Survey History" subtitle="View past surveys" />
      <View style={styles.content}>
        <Ionicons name="time-outline" size={64} color={AppColors.gray300} />
        <Text style={styles.title}>Survey History</Text>
        <Text style={styles.subtitle}>This will be implemented in Module 8</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray700,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.gray400,
  },
});
