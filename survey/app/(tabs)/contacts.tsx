import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import AppHeader from '@/components/AppHeader';
import ContactItem from '@/components/ContactItem';
import EmptyContacts from '@/components/EmptyContacts';
import { AppColors } from '@/constants/theme';

type ContactEntry = {
  id: string;
  name: string;
  phoneNumber?: string;
};

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const formatContact = (c: Contacts.ExistingContact): ContactEntry => ({
    id: c.id,
    name: c.name || 'Unknown',
    phoneNumber: c.phoneNumbers?.[0]?.number,
  });

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setPermissionGranted(false);
        setLoading(false);
        return;
      }
      setPermissionGranted(true);

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        pageSize: 500,
        sort: Contacts.SortTypes.FirstName,
      });

      const formatted = data.map(formatContact);
      setContacts(formatted);
      setFilteredContacts(formatted);
    } catch {
      Alert.alert('Error', 'Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, [fetchContacts]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    const query = text.toLowerCase();
    const filtered = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.phoneNumber && c.phoneNumber.includes(query))
    );
    setFilteredContacts(filtered);
  };

  const handleCopyNumber = (number: string) => {
    Alert.alert('Copied!', `${number} copied to clipboard.`);
  };

  if (permissionGranted === null) {
    return (
      <View style={styles.container}>
        <AppHeader title="Contacts" subtitle="Access your contacts" />
        <View style={styles.centerContent}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="people-outline" size={80} color={AppColors.gray300} />
          </View>
          <Text style={styles.permissionTitle}>Contacts Access Required</Text>
          <Text style={styles.permissionText}>
            We need contacts permission to display your phone contacts for field surveys.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.permissionBtn, pressed && styles.pressed]}
            onPress={fetchContacts}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={AppColors.white} />
            ) : (
              <>
                <Ionicons name="people" size={20} color={AppColors.white} />
                <Text style={styles.permissionBtnText}>Load Contacts</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  if (permissionGranted === false) {
    return (
      <View style={styles.container}>
        <AppHeader title="Contacts" subtitle="Access your contacts" />
        <View style={styles.centerContent}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="lock-closed-outline" size={80} color={AppColors.gray300} />
          </View>
          <Text style={styles.permissionTitle}>Permission Denied</Text>
          <Text style={styles.permissionText}>
            Contacts permission was denied. Please enable it in your device settings.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.permissionBtn, pressed && styles.pressed]}
            onPress={fetchContacts}
          >
            <Ionicons name="refresh" size={20} color={AppColors.white} />
            <Text style={styles.permissionBtnText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Contacts" subtitle={`${filteredContacts.length} contacts`} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={AppColors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={AppColors.gray400}
            value={search}
            onChangeText={handleSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={AppColors.gray400} />
            </Pressable>
          )}
        </View>
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {filteredContacts.length} of {contacts.length}
          </Text>
        </View>
      </View>

      {loading && contacts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : filteredContacts.length === 0 ? (
        <EmptyContacts
          message={search ? `No contacts match "${search}"` : 'No contacts on this device'}
        />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactItem
              name={item.name}
              phoneNumber={item.phoneNumber}
              onCopyNumber={handleCopyNumber}
            />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[AppColors.primary]}
              tintColor={AppColors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray50,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: AppColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  permissionText: {
    fontSize: 14,
    color: AppColors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  permissionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: AppColors.gray800,
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
    paddingRight: 4,
  },
  counterText: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: AppColors.gray500,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  separator: {
    height: 10,
  },
});
