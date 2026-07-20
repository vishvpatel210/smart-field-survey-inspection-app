import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import AppHeader from '@/components/AppHeader';
import HeroSection from '@/components/HeroSection';
import StatsRow from '@/components/StatsRow';
import QuickActionCard from '@/components/QuickActionCard';
import RecentSurveyItem from '@/components/RecentSurveyItem';
import { AppColors, AppShadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useSurvey } from '@/contexts/SurveyContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { surveys, todayCount, deleteSurvey } = useSurvey();
  const { profile } = useProfile();

  const handleDelete = (id: string, siteName: string) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete "${siteName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(id);
            Alert.alert('Deleted', 'Survey has been deleted.');
          },
        },
      ]
    );
  };

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

  const recentSurveys = surveys.slice(0, 5);

  const completedCount = surveys.filter(s => s.status === 'submitted').length;
  const activeCount = surveys.filter(s => s.status === 'draft').length;
  const highRiskCount = surveys.filter(s => s.priority === 'High').length;
  const pendingCount = surveys.length - completedCount - activeCount;

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Smart Survey" 
        subtitle="Field Inspection App" 
        showMenu 
        onMenuPress={() => router.push('/menu')}
        showProfile 
        onProfilePress={() => router.push('/(tabs)/profile')}
      />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AppColors.primary]} tintColor={AppColors.primary} />}
      >
        <HeroSection
          name={profile.name}
          date={today}
          progressPercent={72}
        />

        <StatsRow
          active={activeCount > 0 ? activeCount : 3}
          completed={completedCount > 0 ? completedCount : 18}
          pending={pendingCount > 0 ? pendingCount : 2}
          highRisk={highRiskCount > 0 ? highRiskCount : 1}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.viewAllText} onPress={() => router.push('/(tabs)/new-survey')}>View All</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="New Survey"
              icon="add-circle-outline"
              color={AppColors.primary}
              onPress={() => router.push('/(tabs)/new-survey')}
            />
            <QuickActionCard
              title="Camera"
              icon="camera-outline"
              color={AppColors.secondary}
              onPress={() => router.push('/(tabs)/camera')}
            />
            <QuickActionCard
              title="Location"
              icon="location-outline"
              color={AppColors.warning}
              onPress={() => router.push('/(tabs)/location')}
            />
            <QuickActionCard
              title="Reports"
              icon="document-text-outline"
              color={AppColors.accent}
              onPress={() => router.push('/(tabs)/history')}
            />
            <QuickActionCard
              title="Contacts"
              icon="people-outline"
              color={AppColors.primaryLight}
              onPress={() => router.push('/(tabs)/contacts')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{"Today's Surveys"}</Text>
            <Text style={styles.viewAllText} onPress={() => router.push('/(tabs)/history')}>View All</Text>
          </View>
          <View style={styles.surveysList}>
            {recentSurveys.length > 0 ? (
              recentSurveys.map((survey) => (
                <RecentSurveyItem
                  key={survey.id}
                  siteName={survey.siteName}
                  clientName={survey.clientName}
                  priority={survey.priority}
                  date={survey.date}
                  photo={survey.photo}
                  onPress={() => router.push({ pathname: '/survey-preview', params: { id: survey.id } })}
                  onLongPress={() => handleDelete(survey.id, survey.siteName)}
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
    backgroundColor: AppColors.primary,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: AppColors.gray50,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.gray900,
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primaryLight,
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
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    ...AppShadows.sm,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray400,
  },
  bottomPadding: {
    height: 20,
  },
});
