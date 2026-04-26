import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase';
import InputField from './InputField';
import ButtonPrimary from './ButtonPrrimary';
import Loader from './Loader';
import { addDonation, uploadImage } from './donationService';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from './responsive';

const AddDonationScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const user = auth.currentUser;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow access to your photo library to add a food photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow camera access to take a food photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Add Food Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setUploadProgress(0);

    try {
      let imageUrl = '';

      if (imageUri) {
        imageUrl = await uploadImage(imageUri, user.uid, (progress) => {
          setUploadProgress(progress);
        });
      }

      await addDonation({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        imageUrl,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
      });

      Alert.alert('🎉 Success!', 'Your donation has been added. Thank you for sharing!', [
        {
          text: 'View All',
          onPress: () => {
            setTitle('');
            setDescription('');
            setLocation('');
            setImageUri(null);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add donation. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const loadingMessage = uploadProgress > 0
    ? `Uploading image... ${uploadProgress}%`
    : 'Saving donation...';

  return (
    <View style={styles.container}>
      <Loader visible={loading} message={loadingMessage} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.accent, '#FFC234']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🍱</Text>
            <Text style={styles.headerTitle}>Add Donation</Text>
            <Text style={styles.headerSubtitle}>Share food with your community</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Image Picker */}
            <Text style={styles.sectionLabel}>Food Photo</Text>
            <TouchableOpacity
              style={[styles.imagePicker, SHADOWS.small]}
              onPress={showImageOptions}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <View style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                  <View style={styles.imageOverlay}>
                    <Ionicons name="camera" size={24} color={COLORS.surface} />
                    <Text style={styles.imageOverlayText}>Change Photo</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera-outline" size={32} color={COLORS.primary} />
                  </View>
                  <Text style={styles.imagePickerTitle}>Add a Photo</Text>
                  <Text style={styles.imagePickerSubtitle}>Tap to take or choose from gallery</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Form Fields */}
            <View style={styles.form}>
              <InputField
                label="Food Title *"
                placeholder="e.g. Homemade Chicken Curry"
                value={title}
                onChangeText={setTitle}
                icon="restaurant-outline"
                error={errors.title}
              />
              <InputField
                label="Description *"
                placeholder="Describe the food, quantity, dietary info..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                icon="document-text-outline"
                error={errors.description}
              />
              <InputField
                label="Pickup Location *"
                placeholder="e.g. 123 Main St, Apartment 4B"
                value={location}
                onChangeText={setLocation}
                icon="location-outline"
                error={errors.location}
              />

              {/* Tips */}
              <View style={styles.tipsBox}>
                <Ionicons name="information-circle-outline" size={18} color={COLORS.secondary} />
                <Text style={styles.tipsText}>
                  Ensure food is freshly prepared, properly stored, and safe for consumption.
                </Text>
              </View>

              <ButtonPrimary
                title="Share Donation"
                onPress={handleSubmit}
                loading={loading}
                icon="heart"
                iconPosition="right"
                size="lg"
                style={styles.submitBtn}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: SPACING.xl + SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  headerContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(26,26,46,0.65)',
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: -(SPACING.lg),
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.md,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  imagePicker: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    minHeight: 160,
  },
  imagePreviewWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.lg,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  imageOverlayText: {
    color: COLORS.surface,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  imagePlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.lg,
  },
  cameraIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  imagePickerTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  imagePickerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SPACING.xs,
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8FFFE',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#B2F0EC',
  },
  tipsText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    lineHeight: 18,
  },
  submitBtn: {
    borderRadius: RADIUS.md,
  },
});

export default AddDonationScreen;