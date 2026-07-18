import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import AppHeader from '@/components/AppHeader';
import { AppColors } from '@/constants/theme';

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
};

export default function LocationScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const requestPermissionAndGetLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionGranted(false);
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current position.'
        );
        setLoading(false);
        return;
      }
      setPermissionGranted(true);
      await fetchLocation();
    } catch {
      Alert.alert('Error', 'Failed to request location permission.');
      setLoading(false);
    }
  };

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const now = new Date();
      setLocation({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
        timestamp: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      });
    } catch {
      Alert.alert('Error', 'Failed to get current location. Make sure GPS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    if (permissionGranted) {
      await fetchLocation();
    } else {
      await requestPermissionAndGetLocation();
    }
  };

  const copyLocationToClipboard = async () => {
    if (!location) return;
    const locationText = `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`;
    await Clipboard.setStringAsync(locationText);
    Alert.alert('Copied!', 'Current location has been copied to clipboard.');
  };

  if (permissionGranted === null || permissionGranted === false) {
    return (
      <View style={styles.container}>
        <AppHeader title="Location" subtitle="Get current position" />
        <View style={styles.centerContent}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="location-outline" size={80} color={AppColors.gray300} />
          </View>
          <Text style={styles.permissionTitle}>Location Access Required</Text>
          <Text style={styles.permissionText}>
            We need location permission to display your current GPS coordinates for field surveys.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.permissionBtn, pressed && styles.pressed]}
            onPress={requestPermissionAndGetLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={AppColors.white} />
            ) : (
              <>
                <Ionicons name="location" size={20} color={AppColors.white} />
                <Text style={styles.permissionBtnText}>Enable Location</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Location" subtitle="Current GPS coordinates" />
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && !location && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}

        {location && (
          <>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={48} color={AppColors.primary + '40'} />
              <Text style={styles.mapText}>Location Coordinates</Text>
            </View>

            <View style={styles.coordinatesCard}>
              <View style={styles.coordHeader}>
                <Ionicons name="navigate" size={20} color={AppColors.primary} />
                <Text style={styles.coordTitle}>GPS Coordinates</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.coordRow}>
                <View style={styles.coordItem}>
                  <Text style={styles.coordLabel}>Latitude</Text>
                  <Text style={styles.coordValue}>{location.latitude.toFixed(6)}</Text>
                </View>
                <View style={styles.coordVerticalDivider} />
                <View style={styles.coordItem}>
                  <Text style={styles.coordLabel}>Longitude</Text>
                  <Text style={styles.coordValue}>{location.longitude.toFixed(6)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="radio-button-on" size={16} color={AppColors.secondary} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Accuracy</Text>
                    <Text style={styles.detailValue}>
                      {location.accuracy !== null ? `${location.accuracy.toFixed(1)}m` : 'N/A'}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={16} color={AppColors.warning} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{location.timestamp}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.fullCopyCard}>
              <View style={styles.copyRow}>
                <Ionicons name="copy" size={18} color={AppColors.gray500} />
                <Text style={styles.copyText} numberOfLines={1}>
                  {`Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.refreshBtn, pressed && styles.pressed]}
                onPress={refreshLocation}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={AppColors.primary} />
                ) : (
                  <Ionicons name="refresh" size={22} color={AppColors.primary} />
                )}
                <Text style={styles.refreshBtnText}>
                  {loading ? 'Refreshing...' : 'Refresh Location'}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.copyBtn, pressed && styles.pressed]}
                onPress={copyLocationToClipboard}
              >
                <Ionicons name="clipboard" size={22} color={AppColors.white} />
                <Text style={styles.copyBtnText}>Copy to Clipboard</Text>
              </Pressable>
            </View>
          </>
        )}

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
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: AppColors.gray500,
    fontWeight: '500',
  },
  mapPlaceholder: {
    backgroundColor: AppColors.primary + '08',
    borderRadius: 18,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: AppColors.primary + '20',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 14,
    color: AppColors.primary + '60',
    marginTop: 8,
    fontWeight: '500',
  },
  coordinatesCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  coordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coordTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 16,
  },
  coordRow: {
    flexDirection: 'row',
  },
  coordItem: {
    flex: 1,
    alignItems: 'center',
  },
  coordVerticalDivider: {
    width: 1,
    backgroundColor: AppColors.gray200,
    marginHorizontal: 12,
  },
  coordLabel: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '500',
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.gray900,
    fontVariant: ['tabular-nums'],
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: AppColors.gray400,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
    marginTop: 1,
  },
  fullCopyCard: {
    backgroundColor: AppColors.gray100,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  copyText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.gray600,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: AppColors.primary + '30',
    gap: 8,
  },
  refreshBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  copyBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  bottomPadding: {
    height: 20,
  },
});
