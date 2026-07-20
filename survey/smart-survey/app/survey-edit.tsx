import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import AppHeader from '@/components/AppHeader';
import FormInput from '@/components/FormInput';
import FormTextArea from '@/components/FormTextArea';
import FormPrioritySelect from '@/components/FormPrioritySelect';
import FormDatePicker from '@/components/FormDatePicker';
import { useSurvey } from '@/contexts/SurveyContext';
import { AppColors, AppShadows } from '@/constants/theme';
import { Priority } from '@/types/survey';

type FormErrors = {
  siteName?: string;
  clientName?: string;
  description?: string;
  date?: string;
};

export default function EditSurveyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSurveyById, updateSurvey } = useSurvey();

  const survey = getSurveyById(id || '');

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Contacts picker states
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [allContacts, setAllContacts] = useState<{ id: string; name: string; phone?: string }[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<{ id: string; name: string; phone?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactsLoading, setContactsLoading] = useState(false);

  const openContactsModal = async () => {
    setShowContactsModal(true);
    setContactsLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need contacts permission to let you select a contact.');
        setShowContactsModal(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const parsed = data
        .filter((c) => c.name)
        .map((c) => ({
          id: c.id || String(Math.random()),
          name: c.name,
          phone: c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : undefined,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setAllContacts(parsed);
      setFilteredContacts(parsed);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      Alert.alert('Error', 'Failed to retrieve contacts.');
    } finally {
      setContactsLoading(false);
    }
  };

  const handleSearchContacts = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredContacts(allContacts);
      return;
    }
    const filtered = allContacts.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const selectContact = (name: string) => {
    setClientName(name);
    setErrors(prev => ({ ...prev, clientName: undefined }));
    setShowContactsModal(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (survey) {
      setSiteName(survey.siteName);
      setClientName(survey.clientName);
      setDescription(survey.description);
      setPriority(survey.priority);
      setDate(survey.date);
      setContactName(survey.contactName || '');
      setContactNumber(survey.contactNumber || '');
      setNotes(survey.notes || '');
    }
  }, [survey]);

  if (!survey) {
    return (
      <View style={styles.container}>
        <AppHeader title="Edit Survey" subtitle="Not found" />
        <View style={styles.centerContent}>
          <Ionicons name="document-text-outline" size={64} color={AppColors.gray300} />
          <Text style={styles.notFoundText}>Survey not found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
    updateSurvey(survey.id, {
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
      contactName: contactName.trim() || undefined,
      contactNumber: contactNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    Alert.alert('Saved', 'Survey updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader title="Edit Survey" subtitle={survey.id} />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="location-outline" size={20} color={AppColors.primary} />
            <Text style={styles.formTitle}>Site Information</Text>
          </View>
          <View style={styles.divider} />

          <FormInput
            label="Site Name"
            value={siteName}
            onChangeText={setSiteName}
            placeholder="e.g. Downtown Office Complex"
            error={errors.siteName}
            required
            icon="location"
          />
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>
                Client Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <Pressable 
                style={({ pressed }) => [styles.selectContactLink, pressed && styles.pressed]}
                onPress={openContactsModal}
              >
                <Ionicons name="people" size={14} color={AppColors.primaryLight} />
                <Text style={styles.selectContactLinkText}>Select Contact</Text>
              </Pressable>
            </View>
            <View style={[styles.inputRow, errors.clientName ? styles.inputRowError : null]}>
              <Ionicons name="business" size={20} color={errors.clientName ? AppColors.danger : AppColors.gray400} style={styles.inputRowIcon} />
              <TextInput
                style={styles.inlineInput}
                value={clientName}
                onChangeText={setClientName}
                placeholder="e.g. ABC Corporation (or choose contact)"
                placeholderTextColor={AppColors.gray400}
              />
              <Pressable 
                style={({ pressed }) => [styles.contactsIconBtn, pressed && styles.pressed]}
                onPress={openContactsModal}
              >
                <Ionicons name="people" size={20} color={AppColors.primaryLight} />
              </Pressable>
            </View>
            {errors.clientName && (
              <Text style={styles.inputRowErrorText}>{errors.clientName}</Text>
            )}
          </View>
          <FormTextArea
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the survey scope..."
            error={errors.description}
            required
          />
          <FormPrioritySelect
            label="Priority"
            value={priority}
            onChange={setPriority}
            required
          />
          <FormDatePicker
            label="Survey Date"
            value={date}
            onChange={setDate}
            error={errors.date}
            required
          />
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="person-outline" size={20} color={AppColors.secondary} />
            <Text style={styles.formTitle}>Contact (Optional)</Text>
          </View>
          <View style={styles.divider} />

          <FormInput
            label="Contact Name"
            value={contactName}
            onChangeText={setContactName}
            placeholder="e.g. John Smith"
            icon="person-outline"
          />
          <FormInput
            label="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="e.g. +1 555 123 4567"
            icon="call-outline"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="chatbubble-outline" size={20} color={AppColors.accent} />
            <Text style={styles.formTitle}>Notes (Optional)</Text>
          </View>
          <View style={styles.divider} />

          <FormTextArea
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color={AppColors.white} />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Contacts Picker Modal */}
      <Modal
        visible={showContactsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Client Contact</Text>
              <Pressable 
                style={styles.modalCloseBtn} 
                onPress={() => setShowContactsModal(false)}
              >
                <Ionicons name="close" size={24} color={AppColors.gray800} />
              </Pressable>
            </View>

            <View style={styles.modalSearchBox}>
              <Ionicons name="search" size={20} color={AppColors.gray400} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search contacts..."
                placeholderTextColor={AppColors.gray400}
                value={searchQuery}
                onChangeText={handleSearchContacts}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => handleSearchContacts('')}>
                  <Ionicons name="close-circle" size={20} color={AppColors.gray400} />
                </Pressable>
              )}
            </View>

            {contactsLoading ? (
              <View style={styles.modalLoader}>
                <ActivityIndicator size="large" color={AppColors.primaryLight} />
                <Text style={styles.modalLoaderText}>Loading contacts...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalList}
                renderItem={({ item }) => (
                  <Pressable 
                    style={({ pressed }) => [styles.contactItem, pressed && styles.pressed]}
                    onPress={() => selectContact(item.name)}
                  >
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      {item.phone && <Text style={styles.contactPhone}>{item.phone}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={AppColors.gray300} />
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyContactsText}>
                    {searchQuery ? 'No matching contacts found' : 'No contacts found'}
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.gray500,
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: AppColors.primaryLight,
    borderRadius: 12,
  },
  backBtnText: {
    color: AppColors.white,
    fontWeight: '600',
    fontSize: 15,
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
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    ...AppShadows.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 16,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryLight,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    ...AppShadows.md,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: AppColors.gray200,
    ...AppShadows.sm,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray500,
  },
  pressed: {
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
  // Client Contact Select Custom Styles
  inputContainer: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
  },
  selectContactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectContactLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primaryLight,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
    overflow: 'hidden',
  },
  inputRowError: {
    borderColor: AppColors.danger,
    backgroundColor: AppColors.danger + '05',
  },
  inputRowIcon: {
    paddingLeft: 14,
  },
  inlineInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 15,
    color: AppColors.gray800,
  },
  contactsIconBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderLeftWidth: 1,
    borderLeftColor: AppColors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRowErrorText: {
    fontSize: 12,
    color: AppColors.danger,
    marginTop: 6,
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: AppColors.gray50,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '75%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    margin: 16,
    paddingHorizontal: 14,
    height: 48,
    ...AppShadows.sm,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: AppColors.gray900,
  },
  modalLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoaderText: {
    marginTop: 10,
    color: AppColors.gray500,
    fontSize: 15,
  },
  modalList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '30',
    ...AppShadows.sm,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryLight + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactAvatarText: {
    color: AppColors.primaryLight,
    fontWeight: '700',
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray900,
  },
  contactPhone: {
    fontSize: 12,
    color: AppColors.gray400,
    marginTop: 2,
  },
  emptyContactsText: {
    textAlign: 'center',
    color: AppColors.gray400,
    fontSize: 14,
    marginTop: 40,
  },
});
