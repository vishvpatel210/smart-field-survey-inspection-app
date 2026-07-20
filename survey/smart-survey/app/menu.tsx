import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { AppColors, AppShadows } from '@/constants/theme';
import AppHeader from '@/components/AppHeader';

interface MenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
}

export default function MenuScreen() {
  const router = useRouter();

  const items: MenuItem[] = [
    { label: 'Dashboard', icon: 'home-outline', route: '/' },
    { label: 'New Survey', icon: 'add-circle-outline', route: '/(tabs)/new-survey' },
    { label: 'History', icon: 'time-outline', route: '/(tabs)/history' },
    { label: 'Profile', icon: 'person-outline', route: '/(tabs)/profile' },
    { label: 'Camera', icon: 'camera-outline', route: '/(tabs)/camera' },
    { label: 'Location', icon: 'location-outline', route: '/(tabs)/location' },
    { label: 'Clipboard', icon: 'clipboard-outline', route: '/(tabs)/clipboard' },
    { label: 'Explore', icon: 'compass-outline', route: '/(tabs)/explore' },
    { label: 'Contacts', icon: 'people-outline', route: '/(tabs)/contacts' },
  ];

  const handlePress = (route: Href) => {
    router.push(route);
  };

  return (
    <ThemedView style={styles.container}>
      <AppHeader
        title="Application Menu"
        subtitle="Quick navigation shortcut"
        showBack
        onBackPress={() => router.back()}
      />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {items.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => handlePress(item.route)}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.pressed,
                index === items.length - 1 && styles.lastItem,
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color={AppColors.primaryLight} />
              </View>
              <ThemedText style={styles.label}>
                {item.label}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color={AppColors.gray400} />
            </Pressable>
          ))}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
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
    padding: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...AppShadows.md,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.gray200,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AppColors.primaryLight + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray800,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: AppColors.gray50,
  },
  bottomSpacer: {
    height: 40,
  },
});
