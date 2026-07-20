import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type RecentSurveyItemProps = {
  siteName: string;
  clientName: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  location?: string;
  progress?: number;
  onPress: () => void;
  onLongPress?: () => void;
  photo?: string;
};

const priorityColors = {
  High: AppColors.priorityHigh,
  Medium: AppColors.priorityMedium,
  Low: AppColors.priorityLow,
};

// Deterministic placeholder images based on survey name
const placeholderImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop',
];

export default function RecentSurveyItem({
  siteName,
  clientName,
  priority,
  date,
  location,
  progress = Math.floor(Math.random() * 60) + 20,
  onPress,
  onLongPress,
  photo,
}: RecentSurveyItemProps) {
  const imgIndex = siteName.length % placeholderImages.length;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {/* Left - Thumbnail */}
      <Image
        source={{ uri: photo || placeholderImages[imgIndex] }}
        style={styles.thumbnail}
      />

      {/* Center - Info */}
      <View style={styles.info}>
        <Text style={styles.siteName} numberOfLines={1}>{siteName}</Text>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={13} color={AppColors.gray400} />
          <Text style={styles.detailText} numberOfLines={1}>{clientName}</Text>
        </View>
        {location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={13} color={AppColors.gray400} />
            <Text style={styles.detailText} numberOfLines={1}>{location}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={13} color={AppColors.gray400} />
          <Text style={styles.detailText}>{date}</Text>
        </View>
      </View>

      {/* Right - Priority + Progress */}
      <View style={styles.rightSection}>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] + '15' }]}>
          <Text style={[styles.priorityText, { color: priorityColors[priority] }]}>{priority.toUpperCase()}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressRing, { borderColor: priorityColors[priority] + '30' }]}>
            <View style={[styles.progressRingActive, { borderTopColor: priorityColors[priority], borderRightColor: priorityColors[priority] }]} />
            <Text style={[styles.progressText, { color: priorityColors[priority] }]}>{progress}%</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={AppColors.gray400} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.gray200 + '45',
    marginBottom: 6,
    ...AppShadows.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: AppColors.gray100,
  },
  info: {
    flex: 1,
    marginRight: 10,
    gap: 4,
  },
  siteName: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray900,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.gray500,
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingActive: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
