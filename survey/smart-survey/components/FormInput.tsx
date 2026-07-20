import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type FormInputProps = TextInputProps & {
  label: string;
  error?: string;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function FormInput({ label, error, required, icon, ...props }: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {icon && (
          <Ionicons name={icon} size={20} color={error ? AppColors.danger : AppColors.gray400} style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null]}
          placeholderTextColor={AppColors.gray400}
          {...props}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
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
    alignItems: 'center',
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
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: AppColors.gray800,
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.danger,
    marginTop: 6,
    fontWeight: '500',
  },
});
