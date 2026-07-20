import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/theme';

const drawerItems = [
  { label: 'Dashboard', icon: 'grid-outline', href: '/(tabs)' as const },
  { label: 'New Survey', icon: 'add-circle-outline', href: '/(tabs)/new-survey' as const },
  { label: 'History', icon: 'time-outline', href: '/(tabs)/history' as const },
  { label: 'Camera', icon: 'camera-outline', href: '/(tabs)/camera' as const },
  { label: 'Location', icon: 'location-outline', href: '/(tabs)/location' as const },
  { label: 'Contacts', icon: 'people-outline', href: '/(tabs)/contacts' as const },
  { label: 'Clipboard', icon: 'clipboard-outline', href: '/(tabs)/clipboard' as const },
  { label: 'Profile', icon: 'person-outline', href: '/(tabs)/profile' as const },
];

function CustomDrawerContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.drawerContainer, { paddingTop: insets.top }]}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>VP</Text>
        </View>
        <Text style={styles.profileName}>Vishv Patel</Text>
        <Text style={styles.profileRole}>Field Inspector</Text>
      </View>

      <View style={styles.menuSection}>
        {drawerItems.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={() => router.push(item.href)}
          >
            <Ionicons name={item.icon as any} size={22} color={AppColors.gray700} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
          backgroundColor: AppColors.white,
        },
      }}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: AppColors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.white,
  },
  profileRole: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  menuSection: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 14,
  },
  menuItemPressed: {
    backgroundColor: AppColors.gray100,
  },
  menuLabel: {
    fontSize: 16,
    color: AppColors.gray700,
    fontWeight: '500',
  },
});
