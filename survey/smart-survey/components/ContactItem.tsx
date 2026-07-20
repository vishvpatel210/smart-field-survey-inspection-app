import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { AppColors } from '@/constants/theme';

type ContactItemProps = {
  name: string;
  phoneNumber?: string;
  onCopyNumber: (number: string) => void;
};

const avatarColors = [
  '#2563EB', '#7C3AED', '#DB2777', '#DC2626',
  '#EA580C', '#CA8A04', '#16A34A', '#0891B2',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function ContactItem({ name, phoneNumber, onCopyNumber }: ContactItemProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  const handleCopy = async () => {
    if (phoneNumber) {
      await Clipboard.setStringAsync(phoneNumber);
      onCopyNumber(phoneNumber);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: bgColor }]}>
        <Text style={styles.initials}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {phoneNumber ? (
          <Text style={styles.phone} numberOfLines={1}>{phoneNumber}</Text>
        ) : (
          <Text style={styles.noNumber}>No Number</Text>
        )}
      </View>

      {phoneNumber && (
        <Pressable style={styles.copyBtn} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={18} color={AppColors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray800,
  },
  phone: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 2,
  },
  noNumber: {
    fontSize: 13,
    color: AppColors.gray400,
    fontStyle: 'italic',
    marginTop: 2,
  },
  copyBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: AppColors.primary + '10',
  },
});
