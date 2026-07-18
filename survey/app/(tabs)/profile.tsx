import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '@/components/AppHeader';
import { AppColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/contexts/ProfileContext';

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery permission is needed to set a profile photo. Please enable it in settings.'
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
      updateProfile({ photoUri: result.assets[0].uri });
    }
  };

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" subtitle="Your account details" />
      <View style={styles.content}>
        <Pressable style={({ pressed }) => [styles.avatarContainer, pressed && styles.avatarPressed]} onPress={pickImage}>
          {profile.photoUri ? (
            <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitials}>{initials}</Text>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color={AppColors.white} />
          </View>
        </Pressable>
        <Text style={styles.tapHint}>Tap to change photo</Text>

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.id}>ID: {profile.id}</Text>
        <Text style={styles.course}>{profile.course}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="school" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={styles.infoValue}>{profile.course}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Semester</Text>
              <Text style={styles.infoValue}>{profile.semester}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="id-card" size={20} color={AppColors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Student ID</Text>
              <Text style={styles.infoValue}>{profile.id}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
          onPress={() => router.push('/profile-edit')}
        >
          <Ionicons name="create-outline" size={20} color={AppColors.white} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppColors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  tapHint: {
    fontSize: 12,
    color: AppColors.gray400,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  id: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 4,
  },
  course: {
    fontSize: 14,
    color: AppColors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.gray400,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray800,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 14,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 28,
    gap: 8,
    width: '100%',
  },
  editBtnPressed: {
    opacity: 0.8,
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
});
