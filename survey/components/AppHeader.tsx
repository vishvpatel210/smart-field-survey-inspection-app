import React from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function AppHeader({
  title,
  subtitle,
  showMenu = false,
  onMenuPress,
  rightIcon,
  onRightPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.primary} />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showMenu && (
            <Pressable onPress={onMenuPress} style={styles.menuButton}>
              <Ionicons name="menu" size={24} color={AppColors.white} />
            </Pressable>
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {rightIcon && (
          <Pressable onPress={onRightPress} style={styles.rightButton}>
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
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.white,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  rightButton: {
    padding: 4,
  },
});
