import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import { useSurvey } from '@/contexts/SurveyContext';
import { AppColors, AppShadows } from '@/constants/theme';
import { Priority } from '@/types/survey';

const priorityConfig: Record<Priority, { color: string; bg: string }> = {
  High: { color: AppColors.priorityHigh, bg: AppColors.priorityHigh + '15' },
  Medium: { color: AppColors.priorityMedium, bg: AppColors.priorityMedium + '15' },
  Low: { color: AppColors.priorityLow, bg: AppColors.priorityLow + '15' },
};

export default function SurveyPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSurveyById, updateSurvey, deleteSurvey } = useSurvey();

  const survey = getSurveyById(id || '');

  if (!survey) {
    return (
      <View style={styles.container}>
        <AppHeader title="Survey Details" subtitle="Not found" />
        <View style={styles.centerContent}>
          <Ionicons name="document-text-outline" size={64} color={AppColors.gray300} />
          <Text style={styles.notFoundText}>Survey not found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const pConfig = priorityConfig[survey.priority];

  const handleSubmit = () => {
    Alert.alert(
      'Submit Survey',
      `Are you sure you want to submit survey "${survey.id}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            updateSurvey(survey.id, { status: 'submitted' });
            Alert.alert('Submitted', 'Survey has been submitted successfully!');
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({ pathname: '/survey-edit', params: { id: survey.id } });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete survey "${survey.id}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(survey.id);
            Alert.alert('Deleted', 'Survey has been deleted.', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Survey Preview" subtitle={survey.id} />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, survey.status === 'submitted' ? styles.statusSubmitted : styles.statusDraft]}>
            <Ionicons
              name={survey.status === 'submitted' ? 'checkmark-circle' : 'create-outline'}
              size={16}
              color={survey.status === 'submitted' ? AppColors.success : AppColors.accent}
            />
            <Text style={[styles.statusText, survey.status === 'submitted' ? styles.statusTextSubmitted : styles.statusTextDraft]}>
              {survey.status === 'submitted' ? 'Submitted' : 'Draft'}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: pConfig.bg }]}>
            <Ionicons name="flag-outline" size={14} color={pConfig.color} />
            <Text style={[styles.priorityText, { color: pConfig.color }]}>{survey.priority}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={20} color={AppColors.primary} />
            <Text style={styles.cardTitle}>Site Information</Text>
          </View>
          <View style={styles.divider} />
          <InfoRow label="Site Name" value={survey.siteName} />
          <InfoRow label="Client" value={survey.clientName} />
          <InfoRow label="Survey Date" value={survey.date} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={20} color={AppColors.primary} />
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.descriptionText}>{survey.description}</Text>
        </View>

        {survey.photo && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="camera-outline" size={20} color={AppColors.primary} />
              <Text style={styles.cardTitle}>Captured Photo</Text>
            </View>
            <View style={styles.divider} />
            <Image source={{ uri: survey.photo }} style={styles.photo} resizeMode="cover" />
            {survey.photoTime && (
              <View style={styles.photoTimeRow}>
                <Ionicons name="time-outline" size={14} color={AppColors.gray400} />
                <Text style={styles.photoTimeText}>{survey.photoTime}</Text>
              </View>
            )}
          </View>
        )}

        {(survey.contactName || survey.contactNumber) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color={AppColors.primary} />
              <Text style={styles.cardTitle}>Contact</Text>
            </View>
            <View style={styles.divider} />
            {survey.contactName && <InfoRow label="Name" value={survey.contactName} />}
            {survey.contactNumber && <InfoRow label="Phone" value={survey.contactNumber} />}
          </View>
        )}

        {(survey.latitude || survey.longitude) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="navigate-outline" size={20} color={AppColors.primary} />
              <Text style={styles.cardTitle}>Location</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.locationRow}>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Latitude</Text>
                <Text style={styles.locationValue}>{survey.latitude?.toFixed(6) || 'N/A'}</Text>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Longitude</Text>
                <Text style={styles.locationValue}>{survey.longitude?.toFixed(6) || 'N/A'}</Text>
              </View>
            </View>
            {survey.accuracy !== undefined && (
              <View style={styles.accuracyRow}>
                <Ionicons name="radio-button-on-outline" size={14} color={AppColors.secondary} />
                <Text style={styles.accuracyText}>Accuracy: {survey.accuracy.toFixed(1)}m</Text>
              </View>
            )}
          </View>
        )}

        {survey.notes && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="chatbubble-outline" size={20} color={AppColors.primary} />
              <Text style={styles.cardTitle}>Notes</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.descriptionText}>{survey.notes}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && styles.pressed]}
            onPress={handleEdit}
          >
            <Ionicons name="pencil-outline" size={20} color={AppColors.primary} />
            <Text style={styles.editBtnText}>Edit Survey</Text>
          </Pressable>

          {survey.status === 'draft' && (
            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={AppColors.white} />
              <Text style={styles.submitBtnText}>Submit Survey</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={AppColors.danger} />
            <Text style={styles.deleteBtnText}>Delete Survey</Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '500',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray800,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.gray500,
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: AppColors.primaryLight,
    borderRadius: 12,
  },
  backBtnText: {
    color: AppColors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: AppColors.gray50,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusSubmitted: {
    backgroundColor: AppColors.success + '15',
  },
  statusDraft: {
    backgroundColor: AppColors.accent + '15',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextSubmitted: {
    color: AppColors.success,
  },
  statusTextDraft: {
    color: AppColors.accent,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    ...AppShadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 14,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.gray600,
    lineHeight: 22,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  photoTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  photoTimeText: {
    fontSize: 12,
    color: AppColors.gray400,
  },
  locationRow: {
    flexDirection: 'row',
  },
  locationItem: {
    flex: 1,
    alignItems: 'center',
  },
  locationDivider: {
    width: 1,
    backgroundColor: AppColors.gray200,
    marginHorizontal: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray900,
    fontVariant: ['tabular-nums'],
  },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  accuracyText: {
    fontSize: 13,
    color: AppColors.gray500,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: AppColors.primaryLight + '40',
    gap: 8,
    ...AppShadows.sm,
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primaryLight,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryLight,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    ...AppShadows.md,
  },
  submitBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: AppColors.danger + '25',
    gap: 8,
    ...AppShadows.sm,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.danger,
  },
  pressed: {
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
});
