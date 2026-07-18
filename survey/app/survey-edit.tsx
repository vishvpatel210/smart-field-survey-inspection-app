import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import FormInput from '@/components/FormInput';
import FormTextArea from '@/components/FormTextArea';
import FormPrioritySelect from '@/components/FormPrioritySelect';
import FormDatePicker from '@/components/FormDatePicker';
import { useSurvey } from '@/contexts/SurveyContext';
import { AppColors } from '@/constants/theme';
import { Priority } from '@/types/survey';

type FormErrors = {
  siteName?: string;
  clientName?: string;
  description?: string;
  date?: string;
};

export default function EditSurveyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSurveyById, updateSurvey } = useSurvey();

  const survey = getSurveyById(id || '');

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (survey) {
      setSiteName(survey.siteName);
      setClientName(survey.clientName);
      setDescription(survey.description);
      setPriority(survey.priority);
      setDate(survey.date);
      setContactName(survey.contactName || '');
      setContactNumber(survey.contactNumber || '');
      setNotes(survey.notes || '');
    }
  }, [survey]);

  if (!survey) {
    return (
      <View style={styles.container}>
        <AppHeader title="Edit Survey" subtitle="Not found" />
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
    updateSurvey(survey.id, {
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
      contactName: contactName.trim() || undefined,
      contactNumber: contactNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    Alert.alert('Saved', 'Survey updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader title="Edit Survey" subtitle={survey.id} />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="location" size={20} color={AppColors.primary} />
            <Text style={styles.formTitle}>Site Information</Text>
          </View>
          <View style={styles.divider} />

          <FormInput
            label="Site Name"
            value={siteName}
            onChangeText={setSiteName}
            placeholder="e.g. Downtown Office Complex"
            error={errors.siteName}
            required
            icon="location"
          />
          <FormInput
            label="Client Name"
            value={clientName}
            onChangeText={setClientName}
            placeholder="e.g. ABC Corporation"
            error={errors.clientName}
            required
            icon="business"
          />
          <FormTextArea
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the survey scope..."
            error={errors.description}
            required
          />
          <FormPrioritySelect
            label="Priority"
            value={priority}
            onChange={setPriority}
            required
          />
          <FormDatePicker
            label="Survey Date"
            value={date}
            onChange={setDate}
            error={errors.date}
            required
          />
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="person" size={20} color={AppColors.secondary} />
            <Text style={styles.formTitle}>Contact (Optional)</Text>
          </View>
          <View style={styles.divider} />

          <FormInput
            label="Contact Name"
            value={contactName}
            onChangeText={setContactName}
            placeholder="e.g. John Smith"
            icon="person-outline"
          />
          <FormInput
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="e.g. +1 555 123 4567"
            icon="call-outline"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="chatbubble" size={20} color={AppColors.accent} />
            <Text style={styles.formTitle}>Notes (Optional)</Text>
          </View>
          <View style={styles.divider} />

          <FormTextArea
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={22} color={AppColors.white} />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
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
    backgroundColor: AppColors.primary,
    borderRadius: 12,
  },
  backBtnText: {
    color: AppColors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  formCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 16,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: AppColors.gray300,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray500,
  },
  pressed: {
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
});
