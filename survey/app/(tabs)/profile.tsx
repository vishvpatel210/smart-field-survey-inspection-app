import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Profile" subtitle="Your account details" />
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color={AppColors.white} />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.id}>ID: STU-2026-0451</Text>
        <Text style={styles.course}>B.Tech Civil Engineering</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="school" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={styles.infoValue}>B.Tech Civil Engineering</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Semester</Text>
              <Text style={styles.infoValue}>6th Semester</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>john.doe@university.edu</Text>
            </View>
          </View>
        </View>

        <Text style={styles.placeholder}>More features coming soon...</Text>
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
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  id: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 4,
  },
  course: {
    fontSize: 14,
    color: AppColors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.gray400,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray800,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 14,
  },
  placeholder: {
    marginTop: 30,
    fontSize: 14,
    color: AppColors.gray400,
  },
});
