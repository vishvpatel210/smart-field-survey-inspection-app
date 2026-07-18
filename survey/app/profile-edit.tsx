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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '@/components/AppHeader';
import FormInput from '@/components/FormInput';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/contexts/ProfileContext';

export default function ProfileEditScreen() {
  const { profile, updateProfile } = useProfile();
  const router = useRouter();

  const [name, setName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.id);
  const [course, setCourse] = useState(profile.course);
  const [semester, setSemester] = useState(profile.semester);
  const [email, setEmail] = useState(profile.email);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!course.trim()) newErrors.course = 'Course is required';
    if (!semester.trim()) newErrors.semester = 'Semester is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateProfile({
      name: name.trim(),
      id: studentId.trim(),
      course: course.trim(),
      semester: semester.trim(),
      email: email.trim(),
      photoUri,
    });
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery permission is needed to set a profile photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <AppHeader title="Edit Profile" subtitle="Update your details" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Pressable style={({ pressed }) => [styles.avatarContainer, pressed && styles.avatarPressed]} onPress={pickImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color={AppColors.white} />
            </View>
          </Pressable>
          <Pressable onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>

          <View style={styles.form}>
            <FormInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              icon="person-outline"
              required
              error={errors.name}
            />
            <FormInput
              label="Student ID"
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter student ID"
              icon="id-card-outline"
              required
              error={errors.studentId}
            />
            <FormInput
              label="Course"
              value={course}
              onChangeText={setCourse}
              placeholder="Enter your course"
              icon="school-outline"
              required
              error={errors.course}
            />
            <FormInput
              label="Semester"
              value={semester}
              onChangeText={setSemester}
              placeholder="Enter semester"
              icon="calendar-outline"
              required
              error={errors.semester}
            />
            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              error={errors.email}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.saveBtn, pressed && styles.btnPressed]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color={AppColors.white} />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarPressed: {
    opacity: 0.8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: AppColors.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  changePhotoText: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: AppColors.gray300,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray600,
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
  btnPressed: {
    opacity: 0.7,
  },
});
