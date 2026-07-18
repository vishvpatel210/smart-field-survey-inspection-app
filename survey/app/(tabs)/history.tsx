import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '@/components/AppHeader';
import RecentSurveyItem from '@/components/RecentSurveyItem';
import EmptyContacts from '@/components/EmptyContacts';
import { AppColors } from '@/constants/theme';
import { useSurvey } from '@/contexts/SurveyContext';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const { surveys } = useSurvey();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppHeader title="Survey History" subtitle={`${surveys.length} total`} />
      {surveys.length === 0 ? (
        <EmptyContacts message="No surveys yet. Create your first survey!" />
      ) : (
        <View style={styles.list}>
          {surveys.map((survey) => (
            <RecentSurveyItem
              key={survey.id}
              siteName={survey.siteName}
              clientName={survey.clientName}
              priority={survey.priority}
              date={survey.date}
              onPress={() => router.push({ pathname: '/survey-preview', params: { id: survey.id } })}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  list: {
    padding: 16,
    gap: 12,
  },
});
