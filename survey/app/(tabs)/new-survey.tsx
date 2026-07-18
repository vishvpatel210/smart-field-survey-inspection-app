import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
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
  priority?: string;
  date?: string;
};

export default function CreateSurveyScreen() {
  const router = useRouter();
  const { addSurvey } = useSurvey();

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!siteName.trim()) {
      newErrors.siteName = 'Site name is required';
    }
    if (!clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newSurvey = addSurvey({
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
    });

    Alert.alert('Survey Created', `Survey "${newSurvey.id}" has been created successfully!`, [
      {
        text: 'View History',
        onPress: () => router.push('/(tabs)/history'),
      },
      {
        text: 'Create Another',
        onPress: () => {
          setSiteName('');
          setClientName('');
          setDescription('');
          setPriority('Medium');
          setDate('');
          setErrors({});
        },
      },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Clear Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setSiteName('');
          setClientName('');
          setDescription('');
          setPriority('Medium');
          setDate('');
          setErrors({});
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="New Survey"
        subtitle="Fill in the site details"
        rightIcon="refresh"
        onRightPress={handleClear}
      />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="clipboard" size={22} color={AppColors.primary} />
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
            placeholder="Describe the survey scope and objectives..."
            error={errors.description}
            required
          />

          <FormPrioritySelect
            label="Priority"
            value={priority}
            onChange={setPriority}
            error={errors.priority}
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

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark-circle" size={22} color={AppColors.white} />
            <Text style={styles.submitText}>Create Survey</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
            onPress={handleClear}
          >
            <Ionicons name="trash-outline" size={20} color={AppColors.danger} />
            <Text style={styles.clearText}>Clear Form</Text>
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
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 16,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: AppColors.danger + '30',
    gap: 8,
  },
  clearText: {
    fontSize: 15,
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
