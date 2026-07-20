import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type StudentDetailsCardProps = {
  name: string;
  id: string;
  course: string;
  semester: string;
};

export default function StudentDetailsCard({ name, id, course, semester }: StudentDetailsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="school-outline" size={20} color={AppColors.primary} />
        </View>
        <Text style={styles.headerText}>Student Details</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{id}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Course</Text>
          <Text style={styles.value}>{course}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Semester</Text>
          <Text style={styles.value}>{semester}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    ...AppShadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    backgroundColor: AppColors.primary + '15',
    padding: 8,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.gray900,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: AppColors.gray500,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: AppColors.gray800,
    fontWeight: '700',
  },
});
