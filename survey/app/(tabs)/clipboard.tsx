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
import { AppColors } from '@/constants/theme';
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
      color: AppColors.primary,
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
            <Ionicons name="copy" size={20} color={AppColors.primary} />
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
              <View style={[styles.copyIconContainer, { backgroundColor: item.color + '15' }]}>
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
            <Ionicons name="document-text" size={20} color={AppColors.secondary} />
            <Text style={styles.sectionTitle}>Paste Notes</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Paste clipboard content as notes
          </Text>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={pastedNotes}
              onChangeText={setPastedNotes}
              placeholder="Tap 'Paste from Clipboard' to insert content..."
              placeholderTextColor={AppColors.gray400}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Pressable
              style={({ pressed }) => [styles.pasteBtn, pressed && styles.pressed]}
              onPress={handlePaste}
            >
              <Ionicons name="clipboard-outline" size={20} color={AppColors.white} />
              <Text style={styles.pasteBtnText}>Paste from Clipboard</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="eye" size={20} color={AppColors.accent} />
            <Text style={styles.sectionTitle}>Clipboard Viewer</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.viewerCard, pressed && styles.pressed]}
            onPress={refreshClipboardContent}
          >
            <View style={styles.viewerContent}>
              {loading ? (
                <ActivityIndicator size="small" color={AppColors.primary} />
              ) : (
                <Text style={styles.viewerText} selectable>
                  {clipboardContent || 'Tap to read clipboard'}
                </Text>
              )}
            </View>
            <View style={styles.refreshRow}>
              <Ionicons name="refresh" size={16} color={AppColors.primary} />
              <Text style={styles.refreshText}>Tap to refresh</Text>
            </View>
          </Pressable>
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
    backgroundColor: AppColors.gray50,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
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
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
    marginBottom: 10,
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
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
    overflow: 'hidden',
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
    backgroundColor: AppColors.secondary,
    paddingVertical: 12,
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
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
    overflow: 'hidden',
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
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  refreshText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '500',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: AppColors.danger + '30',
    gap: 8,
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
