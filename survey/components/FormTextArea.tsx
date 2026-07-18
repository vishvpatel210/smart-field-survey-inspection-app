import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type TextAreaProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  numberOfLines?: number;
};

export default function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required,
  numberOfLines = 4,
}: TextAreaProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <Ionicons
          name="document-text-outline"
          size={20}
          color={error ? AppColors.danger : AppColors.gray400}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AppColors.gray400}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
    marginBottom: 8,
  },
  required: {
    color: AppColors.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
  },
  inputError: {
    borderColor: AppColors.danger,
    backgroundColor: AppColors.danger + '05',
  },
  icon: {
    paddingLeft: 14,
    paddingTop: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
    paddingRight: 14,
    fontSize: 15,
    color: AppColors.gray800,
    minHeight: 100,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.danger,
    marginTop: 6,
    fontWeight: '500',
  },
});
