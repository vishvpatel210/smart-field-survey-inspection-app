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
import AppHeader from '@/components/AppHeader';
import { AppColors } from '@/constants/theme';

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
    );
  }

  if (photo) {
    return (
      <View style={styles.container}>
        <AppHeader title="Photo Preview" subtitle="Review captured image" />
        <ScrollView style={styles.previewContainer} contentContainerStyle={styles.previewContent}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="cover" />

          <View style={styles.captureInfoCard}>
            <View style={styles.captureInfoRow}>
              <Ionicons name="time-outline" size={18} color={AppColors.primary} />
              <View style={styles.captureInfoText}>
                <Text style={styles.captureInfoLabel}>Capture Time</Text>
                <Text style={styles.captureInfoValue}>{photo.captureTime}</Text>
              </View>
            </View>
            <View style={styles.captureInfoDivider} />
            <View style={styles.captureInfoRow}>
              <Ionicons name="calendar-outline" size={18} color={AppColors.primary} />
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
              <Ionicons name="refresh" size={22} color={AppColors.primary} />
              <Text style={styles.retakeBtnText}>Retake Photo</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
              onPress={deletePhoto}
            >
              <Ionicons name="trash" size={22} color={AppColors.danger} />
              <Text style={styles.deleteBtnText}>Delete Photo</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.usePhotoBtn, pressed && styles.pressed]}
            onPress={() => Alert.alert('Saved', 'Photo saved to survey.')}
          >
            <Ionicons name="checkmark-circle" size={22} color={AppColors.white} />
            <Text style={styles.usePhotoBtnText}>Use This Photo</Text>
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
    backgroundColor: AppColors.gray50,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
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
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
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
  previewContainer: {
    flex: 1,
  },
  previewContent: {
    padding: 16,
  },
  previewImage: {
    width: '100%',
    height: 350,
    borderRadius: 16,
  },
  captureInfoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  captureInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captureInfoText: {
    flex: 1,
  },
  captureInfoLabel: {
    fontSize: 12,
    color: AppColors.gray400,
  },
  captureInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray800,
    marginTop: 2,
  },
  captureInfoDivider: {
    height: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 12,
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
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: AppColors.primary + '30',
    gap: 8,
  },
  retakeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.primary,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: AppColors.danger + '30',
    gap: 8,
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
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 12,
    gap: 8,
  },
  usePhotoBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
});
