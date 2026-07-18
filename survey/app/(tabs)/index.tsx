import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import AppHeader from '@/components/AppHeader';
import WelcomeSection from '@/components/WelcomeSection';
import StudentDetailsCard from '@/components/StudentDetailsCard';
import SurveyCountCard from '@/components/SurveyCountCard';
import QuickActionCard from '@/components/QuickActionCard';
import RecentSurveyItem from '@/components/RecentSurveyItem';
import { AppColors } from '@/constants/theme';
import { useRouter } from 'expo-router';

const mockRecentSurveys = [
  {
    id: '1',
    siteName: 'Downtown Office Complex',
    clientName: 'ABC Corporation',
    priority: 'High' as const,
    date: 'Jul 18, 2026',
  },
  {
    id: '2',
    siteName: 'Riverside Mall',
    clientName: 'Metro Properties',
    priority: 'Medium' as const,
    date: 'Jul 17, 2026',
  },
  {
    id: '3',
    siteName: 'Green Valley Residential',
    clientName: 'HomeBuild Inc.',
    priority: 'Low' as const,
    date: 'Jul 16, 2026',
  },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Smart Survey" subtitle="Field Inspection App" showMenu />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AppColors.primary]} tintColor={AppColors.primary} />}
      >
        <WelcomeSection studentName="John Doe" date={today} />

        <StudentDetailsCard
          name="John Doe"
          id="STU-2026-0451"
          course="B.Tech Civil Engineering"
          semester="6th"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Survey Overview</Text>
          <SurveyCountCard count={5} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="New Survey"
              icon="add-circle"
              color={AppColors.primary}
              onPress={() => router.push('/(tabs)/new-survey')}
            />
            <QuickActionCard
              title="Camera"
              icon="camera"
              color={AppColors.secondary}
              onPress={() => {}}
            />
            <QuickActionCard
              title="Location"
              icon="location"
              color={AppColors.warning}
              onPress={() => {}}
            />
            <QuickActionCard
              title="Contacts"
              icon="people"
              color={AppColors.accent}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Surveys</Text>
          <View style={styles.surveysList}>
            {mockRecentSurveys.map((survey) => (
              <RecentSurveyItem
                key={survey.id}
                siteName={survey.siteName}
                clientName={survey.clientName}
                priority={survey.priority}
                date={survey.date}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray800,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  surveysList: {
    gap: 12,
  },
  bottomPadding: {
    height: 20,
  },
});
