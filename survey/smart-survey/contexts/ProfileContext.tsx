import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  name: string;
  studentId: string;
  course: string;
  semester: string;
  email: string;
  avatarUri: string;
};

type ProfileContextType = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
};

const defaultProfile: UserProfile = {
  name: 'Vishv Patel',
  studentId: 'STU-2026-0451',
  course: 'B.Tech Civil Engineering',
  semester: '6th Semester',
  email: 'vishv.patel@university.edu',
  avatarUri: 'https://i.pravatar.cc/150?img=11', // default avatar
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
const PROFILE_STORAGE_KEY = '@app_user_profile';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadProfile();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (!isLoaded) {
    // You could return a loading spinner or splash screen here
    return null;
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
