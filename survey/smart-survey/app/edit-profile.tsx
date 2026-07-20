import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppShadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  // Local state for the form inputs initialized with global state
  const [name, setName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [course, setCourse] = useState(profile.course);
  const [semester, setSemester] = useState(profile.semester);
  const [email, setEmail] = useState(profile.email);

  const handleSave = () => {
    updateProfile({ name, studentId, course, semester, email });
    Alert.alert('Profile Updated', 'Your profile information has been saved successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Edit Profile"
        subtitle="Update your information"
        showBack
        onBackPress={() => router.back()}
      />
      
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={AppColors.gray400}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={styles.input}
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter your ID"
              placeholderTextColor={AppColors.gray400}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course</Text>
            <TextInput
              style={styles.input}
              value={course}
              onChangeText={setCourse}
              placeholder="e.g. B.Tech Civil Engineering"
              placeholderTextColor={AppColors.gray400}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Semester</Text>
            <TextInput
              style={styles.input}
              value={semester}
              onChangeText={setSemester}
              placeholder="e.g. 6th Semester"
              placeholderTextColor={AppColors.gray400}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={AppColors.gray400}
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>

        </View>
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: AppColors.white,
    padding: 24,
    borderRadius: 24,
    ...AppShadows.lg,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.gray50,
    borderWidth: 1,
    borderColor: AppColors.gray200,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: AppColors.gray900,
  },
  saveButton: {
    backgroundColor: AppColors.primaryLight,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    ...AppShadows.md,
  },
  saveButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
