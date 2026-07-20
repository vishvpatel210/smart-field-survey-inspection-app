import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type EmptyContactsProps = {
  message?: string;
};

export default function EmptyContacts({ message = 'No contacts found' }: EmptyContactsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="people-outline" size={64} color={AppColors.gray300} />
      </View>
      <Text style={styles.title}>No Contacts</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray700,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: AppColors.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },
});
