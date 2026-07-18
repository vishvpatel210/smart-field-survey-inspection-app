import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

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
        <Ionicons name="person" size={24} color={AppColors.white} />
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
    borderRadius: 16,
    padding: 16,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.white,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
