import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type WelcomeSectionProps = {
  studentName: string;
  date: string;
};

export default function WelcomeSection({ studentName, date }: WelcomeSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-outline" size={26} color={AppColors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}!</Text>
        <Text style={styles.name}>{studentName}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 24,
    padding: 20,
    ...AppShadows.lg,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppShadows.sm,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.white,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
