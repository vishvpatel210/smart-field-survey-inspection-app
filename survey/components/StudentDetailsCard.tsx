import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

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
        <Ionicons name="school" size={20} color={AppColors.primary} />
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
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: AppColors.gray800,
    fontWeight: '600',
  },
});
