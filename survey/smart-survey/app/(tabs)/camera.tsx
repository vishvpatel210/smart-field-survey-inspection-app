import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AppHeader from '@/components/AppHeader'; 
import { AppColors, AppShadows } from '@/constants/theme';

type PhotoData = {
  uri: string;
  captureTime: string;
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [saving, setSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady) return;

    setLoading(true);
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (result) {
        const now = new Date();
        setPhoto({
          uri: result.uri,
          captureTime: formatTime(now),
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const deletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPhoto(null);
            Alert.alert('Deleted', 'Photo has been deleted.');
          },
        },
      ]
    );
  };

  const saveToGallery = async () => {
    if (!photo) return;

    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Gallery permission is needed to save photos. Please enable it in settings.'
        );
        setSaving(false);
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      if (asset) {
        Alert.alert('Saved!', 'Photo has been saved to your gallery.', [
          { text: 'OK' },
        ]);
      }
    } catch {
      Alert.alert('Error', 'Failed to save photo to gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <AppHeader title="Camera" subtitle="Capture site photos" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Checking permissions...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <AppHeader title="Camera" subtitle="Capture site photos" />
        <View style={styles.scrollContent}>
          <View style={styles.centerContent}>
            <View style={styles.permissionIconContainer}>
              <Ionicons name="camera-outline" size={80} color={AppColors.gray300} />
            </View>
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionText}>
              We need camera permission to capture site photos for your field surveys.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.permissionBtn, pressed && styles.pressed]}
              onPress={requestPermission}
            >
              <Ionicons name="camera" size={20} color={AppColors.white} />
              <Text style={styles.permissionBtnText}>Grant Permission</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <AppHeader title="Photo Preview" subtitle="Review captured image" />
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.previewContent}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="cover" />

          <View style={styles.captureInfoCard}>
            <View style={styles.captureInfoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={18} color={AppColors.primaryLight} />
              </View>
              <View style={styles.captureInfoText}>
                <Text style={styles.captureInfoLabel}>Capture Time</Text>
                <Text style={styles.captureInfoValue}>{photo.captureTime}</Text>
              </View>
            </View>
            <View style={styles.captureInfoDivider} />
            <View style={styles.captureInfoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar-outline" size={18} color={AppColors.primaryLight} />
              </View>
              <View style={styles.captureInfoText}>
                <Text style={styles.captureInfoLabel}>Date</Text>
                <Text style={styles.captureInfoValue}>{formatDate(new Date())}</Text>
              </View>
            </View>
          </View>

          <View style={styles.previewActions}>
            <Pressable
              style={({ pressed }) => [styles.retakeBtn, pressed && styles.pressed]}
              onPress={retakePhoto}
            >
              <Ionicons name="refresh" size={20} color={AppColors.primaryLight} />
              <Text style={styles.retakeBtnText}>Retake</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
              onPress={deletePhoto}
            >
              <Ionicons name="trash" size={20} color={AppColors.danger} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.usePhotoBtn, pressed && styles.pressed, saving && styles.usePhotoBtnDisabled]}
            onPress={saveToGallery}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={AppColors.white} />
            ) : (
              <Ionicons name="download" size={22} color={AppColors.white} />
            )}
            <Text style={styles.usePhotoBtnText}>
              {saving ? 'Saving...' : 'Save to Gallery'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Camera" subtitle="Capture site photos" />
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          flash={flash}
          onCameraReady={() => setCameraReady(true)}
        />

        {!cameraReady && (
          <View style={styles.cameraLoadingOverlay}>
            <ActivityIndicator size="large" color={AppColors.white} />
            <Text style={styles.cameraLoadingText}>Opening Camera...</Text>
          </View>
        )}

        <View style={styles.topBar}>
          <Pressable
            style={styles.topBarBtn}
            onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
          >
            <Ionicons
              name={flash === 'on' ? 'flash' : 'flash-off'}
              size={24}
              color={AppColors.white}
            />
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <Pressable style={styles.galleryBtn} onPress={() => {}}>
            <Ionicons name="images" size={28} color={AppColors.white} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.captureBtn,
              pressed && styles.captureBtnPressed,
              (!cameraReady || loading) && styles.captureBtnDisabled,
            ]}
            onPress={takePicture}
            disabled={!cameraReady || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={AppColors.white} />
            ) : (
              <View style={styles.captureBtnInner} />
            )}
          </Pressable>

          <Pressable style={styles.flipBtn} onPress={() => {}}>
            <Ionicons name="camera-reverse" size={28} color={AppColors.white} />
          </Pressable>
        </View>
      </View>
    </View>
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
    paddingHorizontal: 32,
    gap: 16,
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 12,
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
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
    ...AppShadows.md,
  },
  permissionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  camera: {
    flex: 1,
  },
  cameraLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cameraLoadingText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  topBarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  galleryBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  captureBtnDisabled: {
    opacity: 0.5,
  },
  captureBtnInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: AppColors.white,
  },
  flipBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: AppColors.gray50,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  previewContent: {
    padding: 16,
    paddingTop: 24,
  },
  previewImage: {
    width: '100%',
    height: 350,
    borderRadius: 20,
  },
  captureInfoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200 + '50',
    ...AppShadows.md,
  },
  captureInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AppColors.primaryLight + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInfoText: {
    flex: 1,
  },
  captureInfoLabel: {
    fontSize: 12,
    color: AppColors.gray400,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  captureInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray800,
    marginTop: 2,
  },
  captureInfoDivider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginVertical: 14,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: AppColors.primaryLight + '40',
    gap: 8,
    ...AppShadows.sm,
  },
  retakeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.primaryLight,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: AppColors.danger + '25',
    gap: 8,
    ...AppShadows.sm,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.danger,
  },
  usePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.success,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 16,
    gap: 8,
    ...AppShadows.md,
  },
  usePhotoBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  usePhotoBtnDisabled: {
    opacity: 0.6,
  },
});
