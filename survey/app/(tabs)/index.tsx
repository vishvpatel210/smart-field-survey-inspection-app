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
import { useSurvey } from '@/contexts/SurveyContext';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { surveys, todayCount } = useSurvey();

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

  const recentSurveys = surveys.slice(0, 3);

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
          <SurveyCountCard count={todayCount > 0 ? todayCount : surveys.length} />
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
              onPress={() => router.push('/(tabs)/camera')}
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
            {recentSurveys.length > 0 ? (
              recentSurveys.map((survey) => (
                <RecentSurveyItem
                  key={survey.id}
                  siteName={survey.siteName}
                  clientName={survey.clientName}
                  priority={survey.priority}
                  date={survey.date}
                  onPress={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No surveys yet. Create your first one!</Text>
              </View>
            )}
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
  emptyState: {
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray400,
  },
  bottomPadding: {
    height: 20,
  },
});
