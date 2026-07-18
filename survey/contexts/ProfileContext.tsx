import React, { createContext, useContext, useState, useCallback } from 'react';
import { Profile, ProfileContextType } from '@/types/survey';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultProfile: Profile = {
  name: 'John Doe',
  id: 'STU-2026-0451',
  course: 'B.Tech Civil Engineering',
  semester: '6th Semester',
  email: 'john.doe@university.edu',
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const updateProfile = useCallback((data: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
