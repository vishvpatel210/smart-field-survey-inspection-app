import React from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';
import { useProfile } from '@/contexts/ProfileContext';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  showProfile?: boolean;
  onProfilePress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function AppHeader({
  title,
  subtitle,
  showMenu = false,
  onMenuPress,
  showBack = false,
  onBackPress,
  showProfile = false,
  onProfilePress,
  rightIcon,
  onRightPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  
  const { profile } = useProfile();
  const avatarUri = profile.avatarUri;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.primary} />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack ? (
            <Pressable onPress={onBackPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Ionicons name="arrow-back-outline" size={26} color={AppColors.white} />
            </Pressable>
          ) : showMenu ? (
            <Pressable onPress={onMenuPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Ionicons name="menu-outline" size={26} color={AppColors.white} />
            </Pressable>
          ) : null}
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {showProfile && (
          <View style={styles.rightSection}>
            <Pressable style={({ pressed }) => [styles.bellButton, pressed && styles.pressed]}>
              <Ionicons name="notifications-outline" size={24} color={AppColors.white} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </Pressable>
            <Pressable onPress={onProfilePress} style={({ pressed }) => pressed && styles.pressed}>
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
              />
            </Pressable>
          </View>
        )}
        {rightIcon && (
          <Pressable onPress={onRightPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Ionicons name={rightIcon} size={24} color={AppColors.white} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primary,
    paddingBottom: 32, // Extra padding to be overlapped by scrollview
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...AppShadows.md,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: AppColors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: AppColors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  badgeText: {
    color: AppColors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
