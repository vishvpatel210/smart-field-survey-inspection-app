import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppShadows } from '@/constants/theme';
import { useSurvey } from '@/contexts/SurveyContext';

type ClipboardItem = {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export default function ClipboardScreen() {
  const { surveys } = useSurvey();
  const [pastedNotes, setPastedNotes] = useState('');
  const [clipboardContent, setClipboardContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  const latestSurvey = surveys.length > 0 ? surveys[0] : null;

  const copyableItems: ClipboardItem[] = [
    {
      id: 'survey-id',
      label: 'Survey ID',
      value: latestSurvey?.id || 'SRV-000',
      icon: 'clipboard',
      color: AppColors.primaryLight,
    },
    {
      id: 'contact-number',
      label: 'Contact Number',
      value: '+1 (555) 123-4567',
      icon: 'call',
      color: AppColors.secondary,
    },
    {
      id: 'location',
      label: 'Current Location',
      value: 'Lat: 40.712776, Lng: -74.005974',
      icon: 'location',
      color: AppColors.warning,
    },
  ];

  const handleCopy = async (item: ClipboardItem) => {
    await Clipboard.setStringAsync(item.value);
    setLastCopied(item.id);
    Alert.alert('Copied!', `${item.label} copied to clipboard.`);
    setTimeout(() => setLastCopied(null), 2000);
  };

  const handlePaste = async () => {
    const content = await Clipboard.getStringAsync();
    if (content) {
      setPastedNotes(content);
      Alert.alert('Pasted', 'Clipboard content has been pasted.');
    } else {
      Alert.alert('Empty', 'Clipboard is empty.');
    }
  };

  const handleClearClipboard = () => {
    Alert.alert(
      'Clear Clipboard',
      'Are you sure you want to clear all clipboard data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await Clipboard.setStringAsync('');
            setClipboardContent('(empty)');
            setPastedNotes('');
            setLastCopied(null);
            Alert.alert('Cleared', 'Clipboard has been cleared.');
          },
        },
      ]
    );
  };

  const refreshClipboardContent = useCallback(async () => {
    setLoading(true);
    const content = await Clipboard.getStringAsync();
    setClipboardContent(content || '(empty)');
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="Clipboard" subtitle="Copy & paste data" />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="copy" size={20} color={AppColors.primaryLight} />
            <Text style={styles.sectionTitle}>Quick Copy</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Tap any item below to copy it to your clipboard
          </Text>

          {copyableItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.copyCard,
                pressed && styles.pressed,
                lastCopied === item.id && styles.copiedCard,
              ]}
              onPress={() => handleCopy(item)}
            >
              <View style={[styles.copyIconContainer, { backgroundColor: item.color + '12' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.copyInfo}>
                <Text style={styles.copyLabel}>{item.label}</Text>
                <Text style={styles.copyValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
              <View style={styles.copyAction}>
                {lastCopied === item.id ? (
                  <Ionicons name="checkmark-circle" size={22} color={AppColors.success} />
                ) : (
                  <Ionicons name="copy-outline" size={20} color={AppColors.gray400} />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard-outline" size={20} color={AppColors.primaryLight} />
            <Text style={styles.sectionTitle}>Paste Notes</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Paste data from your clipboard to save as local notes
          </Text>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Pasted clipboard content will appear here..."
              placeholderTextColor={AppColors.gray400}
              value={pastedNotes}
              onChangeText={setPastedNotes}
            />
            <Pressable
              style={({ pressed }) => [styles.pasteBtn, pressed && styles.pressed]}
              onPress={handlePaste}
            >
              <Ionicons name="clipboard" size={20} color={AppColors.white} />
              <Text style={styles.pasteBtnText}>Paste Clipboard</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="eye-outline" size={20} color={AppColors.primaryLight} />
            <Text style={styles.sectionTitle}>Clipboard Viewer</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Inspect the active system clipboard content
          </Text>

          <View style={styles.viewerCard}>
            <View style={styles.viewerContent}>
              {loading ? (
                <ActivityIndicator size="small" color={AppColors.primaryLight} />
              ) : (
                <Text style={styles.viewerText}>{clipboardContent || 'Click refresh below to load'}</Text>
              )}
            </View>
            <Pressable
              style={styles.refreshRow}
              onPress={refreshClipboardContent}
              disabled={loading}
            >
              <Ionicons name="refresh" size={16} color={AppColors.primaryLight} />
              <Text style={styles.refreshText}>Tap to refresh</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trash" size={20} color={AppColors.danger} />
            <Text style={styles.sectionTitle}>Clear Data</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
            onPress={handleClearClipboard}
          >
            <Ionicons name="trash-outline" size={20} color={AppColors.danger} />
            <Text style={styles.clearBtnText}>Clear Clipboard Data</Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
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
    padding: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: AppColors.gray400,
    marginBottom: 14,
  },
  copyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    marginBottom: 10,
    ...AppShadows.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  copiedCard: {
    borderColor: AppColors.success + '50',
    backgroundColor: AppColors.success + '05',
  },
  copyIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  copyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
  },
  copyValue: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 2,
  },
  copyAction: {
    padding: 4,
  },
  textAreaContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    overflow: 'hidden',
    ...AppShadows.sm,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    fontSize: 15,
    color: AppColors.gray800,
    minHeight: 120,
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryLight,
    paddingVertical: 14,
    gap: 8,
    marginHorizontal: 0,
  },
  pasteBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.white,
  },
  viewerCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    overflow: 'hidden',
    ...AppShadows.sm,
  },
  viewerContent: {
    padding: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  viewerText: {
    fontSize: 14,
    color: AppColors.gray600,
    lineHeight: 22,
  },
  refreshRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  refreshText: {
    fontSize: 12,
    color: AppColors.primaryLight,
    fontWeight: '500',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: AppColors.danger + '25',
    gap: 8,
    ...AppShadows.sm,
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.danger,
  },
  bottomPadding: {
    height: 20,
  },
});
