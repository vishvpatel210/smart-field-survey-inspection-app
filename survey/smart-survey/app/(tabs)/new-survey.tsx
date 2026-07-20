import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
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
  priority?: string;
  date?: string;
  photo?: string;
  location?: string;
};

export default function CreateSurveyScreen() {
  const router = useRouter();
  const { addSurvey } = useSurvey();

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
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

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', `Camera ${useCamera ? 'access' : 'roll'} permission is required.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setPhoto(result.assets[0].uri);
        setErrors(prev => ({ ...prev, photo: undefined }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Something went wrong while trying to select an image.');
    }
  };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to create a survey.');
        setIsLocating(false);
        return;
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(locationResult.coords.latitude);
      setLongitude(locationResult.coords.longitude);
      setAccuracy(locationResult.coords.accuracy ?? null);
      setErrors(prev => ({ ...prev, location: undefined }));
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Could not fetch your GPS location. Would you like to use fallback mock coordinates for testing?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Use Mock GPS',
            onPress: () => {
              setLatitude(37.7749);
              setLongitude(-122.4194);
              setAccuracy(10);
              setErrors(prev => ({ ...prev, location: undefined }));
            }
          }
        ]
      );
    } finally {
      setIsLocating(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!siteName.trim()) {
      newErrors.siteName = 'Site name is required';
    }
    if (!clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    if (!photo) {
      newErrors.photo = 'Site photo is required';
    }
    if (latitude === null || longitude === null) {
      newErrors.location = 'GPS Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields, including photo and location.');
      return;
    }

    const photoTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ', ' + new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newSurvey = addSurvey({
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date,
      photo: photo || undefined,
      photoTime,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      accuracy: accuracy !== null ? accuracy : undefined,
    });

    Alert.alert('Survey Created', `Survey "${newSurvey.id}" has been created successfully!`, [
      {
        text: 'View History',
        onPress: () => router.push('/(tabs)/history'),
      },
      {
        text: 'Create Another',
        onPress: () => {
          setSiteName('');
          setClientName('');
          setDescription('');
          setPriority('Medium');
          setDate('');
          setPhoto(null);
          setLatitude(null);
          setLongitude(null);
          setAccuracy(null);
          setErrors({});
        },
      },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Clear Form', 'Are you sure you want to clear all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setSiteName('');
          setClientName('');
          setDescription('');
          setPriority('Medium');
          setDate('');
          setPhoto(null);
          setLatitude(null);
          setLongitude(null);
          setAccuracy(null);
          setErrors({});
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="New Survey"
        subtitle="Fill in the site details"
      />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="clipboard-outline" size={22} color={AppColors.primary} />
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
            placeholder="Describe the survey scope and objectives..."
            error={errors.description}
            required
          />

          <FormPrioritySelect
            label="Priority"
            value={priority}
            onChange={setPriority}
            error={errors.priority}
            required
          />

          <FormDatePicker
            label="Survey Date"
            value={date}
            onChange={setDate}
            error={errors.date}
            required
          />

          <View style={styles.formSectionDivider} />

          {/* Site Photo Section */}
          <View style={styles.formSectionHeaderRow}>
            <Ionicons name="camera-outline" size={20} color={AppColors.primary} />
            <Text style={styles.sectionSubTitle}>Site Photo <Text style={styles.requiredAsterisk}>*</Text></Text>
          </View>
          <View style={styles.photoContainer}>
            {photo ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photo }} style={styles.photoPreview} />
                <Pressable style={styles.removePhotoBtn} onPress={() => setPhoto(null)}>
                  <Ionicons name="close-circle" size={24} color={AppColors.danger} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.photoButtonsRow}>
                <Pressable 
                  style={({ pressed }) => [styles.photoSelectBtn, pressed && styles.pressed]}
                  onPress={() => handlePickImage(true)}
                >
                  <Ionicons name="camera" size={24} color={AppColors.primary} />
                  <Text style={styles.photoBtnText}>Take Photo</Text>
                </Pressable>
                <Pressable 
                  style={({ pressed }) => [styles.photoSelectBtn, pressed && styles.pressed]}
                  onPress={() => handlePickImage(false)}
                >
                  <Ionicons name="image" size={24} color={AppColors.primary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </Pressable>
              </View>
            )}
            {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
          </View>

          <View style={styles.formSectionDivider} />

          {/* Location Section */}
          <View style={styles.formSectionHeaderRow}>
            <Ionicons name="navigate-outline" size={20} color={AppColors.primary} />
            <Text style={styles.sectionSubTitle}>GPS Location <Text style={styles.requiredAsterisk}>*</Text></Text>
          </View>
          <View style={styles.locationContainer}>
            {latitude !== null && longitude !== null ? (
              <View style={styles.locationDisplayCard}>
                <View style={styles.locationDataRow}>
                  <View style={styles.coordBox}>
                    <Text style={styles.coordLabel}>Latitude</Text>
                    <Text style={styles.coordValue}>{latitude.toFixed(6)}</Text>
                  </View>
                  <View style={styles.coordBox}>
                    <Text style={styles.coordLabel}>Longitude</Text>
                    <Text style={styles.coordValue}>{longitude.toFixed(6)}</Text>
                  </View>
                </View>
                {accuracy !== null && (
                  <Text style={styles.locationAccuracyText}>
                    Accuracy: ±{accuracy.toFixed(1)} meters
                  </Text>
                )}
                <Pressable 
                  style={({ pressed }) => [styles.locationRefreshBtn, pressed && styles.pressed]}
                  onPress={handleGetLocation}
                >
                  <Ionicons name="refresh" size={16} color={AppColors.primary} />
                  <Text style={styles.locationRefreshText}>Update Location</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable 
                style={({ pressed }) => [styles.locationGetBtn, pressed && styles.pressed]}
                onPress={handleGetLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color={AppColors.white} />
                ) : (
                  <>
                    <Ionicons name="location" size={20} color={AppColors.white} />
                    <Text style={styles.locationGetText}>Get Current Location</Text>
                  </>
                )}
              </Pressable>
            )}
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color={AppColors.white} />
            <Text style={styles.submitText}>Create Survey</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
            onPress={handleClear}
          >
            <Ionicons name="trash-outline" size={20} color={AppColors.danger} />
            <Text style={styles.clearText}>Clear Form</Text>
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
  scrollContent: {
    flex: 1,
    backgroundColor: AppColors.gray50,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    ...AppShadows.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 16,
  },
  formSectionDivider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginVertical: 20,
  },
  formSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionSubTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  requiredAsterisk: {
    color: AppColors.danger,
  },
  photoContainer: {
    width: '100%',
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    padding: 2,
    ...AppShadows.sm,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: AppColors.primaryLight + '50',
    borderRadius: 14,
    backgroundColor: AppColors.primaryLight + '05',
    gap: 8,
  },
  photoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primaryLight,
  },
  locationContainer: {
    width: '100%',
  },
  locationDisplayCard: {
    backgroundColor: AppColors.gray50,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
  },
  locationDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordBox: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 11,
    color: AppColors.gray400,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  coordValue: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  locationAccuracyText: {
    fontSize: 12,
    color: AppColors.gray500,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  locationRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  locationRefreshText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primaryLight,
  },
  locationGetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    ...AppShadows.md,
  },
  locationGetText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.white,
  },
  errorText: {
    color: AppColors.danger,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primaryLight,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    ...AppShadows.md,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: AppColors.danger + '25',
    gap: 8,
    ...AppShadows.sm,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.danger,
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
