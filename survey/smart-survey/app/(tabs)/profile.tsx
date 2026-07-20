import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppShadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Profile" 
        subtitle="Your account details" 
        rightIcon="create-outline"
        onRightPress={() => router.push('/edit-profile')}
      />
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Pressable 
          style={({ pressed }) => [styles.avatarContainer, pressed && styles.avatarPressed]} 
          onPress={pickImage}
        >
          <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
          <View style={styles.editIconBadge}>
            <Ionicons name="camera" size={14} color={AppColors.white} />
          </View>
        </Pressable>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.id}>ID: {profile.studentId}</Text>
        <Text style={styles.course}>{profile.course}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="school-outline" size={20} color={AppColors.primaryLight} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Course</Text>
              <Text style={styles.infoValue}>{profile.course}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={20} color={AppColors.primaryLight} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Semester</Text>
              <Text style={styles.infoValue}>{profile.semester}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={20} color={AppColors.primaryLight} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.placeholder}>More features coming soon...</Text>
        <View style={styles.bottomSpacer} />
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...AppShadows.md,
  },
  avatarPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: AppColors.primaryLight,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.gray50,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.gray900,
    letterSpacing: -0.5,
  },
  id: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 4,
    fontWeight: '500',
  },
  course: {
    fontSize: 14,
    color: AppColors.primaryLight,
    marginTop: 4,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    ...AppShadows.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AppColors.primaryLight + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray850 || '#1E293B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginVertical: 14,
  },
  placeholder: {
    marginTop: 30,
    fontSize: 14,
    color: AppColors.gray400,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
