import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';
import { Priority } from '@/types/survey';

type FormPrioritySelectProps = {
  label: string;
  value: Priority;
  onChange: (value: Priority) => void;
  error?: string;
  required?: boolean;
};

const priorities: { label: Priority; color: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'High', color: AppColors.priorityHigh, icon: 'flag' },
  { label: 'Medium', color: AppColors.priorityMedium, icon: 'flag' },
  { label: 'Low', color: AppColors.priorityLow, icon: 'flag' },
];

export default function FormPrioritySelect({
  label,
  value,
  onChange,
  error,
  required,
}: FormPrioritySelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = priorities.find((p) => p.label === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <Pressable
        style={[styles.selector, error ? styles.selectorError : null]}
        onPress={() => setVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selected && (
            <View style={[styles.dot, { backgroundColor: selected.color }]} />
          )}
          <Text style={styles.selectorText}>{value || 'Select priority'}</Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={AppColors.gray400} />
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select Priority</Text>
            {priorities.map((p) => (
              <Pressable
                key={p.label}
                style={[
                  styles.option,
                  value === p.label && styles.optionSelected,
                ]}
                onPress={() => {
                  onChange(p.label);
                  setVisible(false);
                }}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.dot, { backgroundColor: p.color }]} />
                  <Text style={[styles.optionText, value === p.label && styles.optionTextSelected]}>
                    {p.label}
                  </Text>
                </View>
                {value === p.label && (
                  <Ionicons name="checkmark-circle" size={22} color={AppColors.primary} />
                )}
              </Pressable>
            ))}
            <Pressable style={styles.cancelBtn} onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorError: {
    borderColor: AppColors.danger,
    backgroundColor: AppColors.danger + '05',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectorText: {
    fontSize: 15,
    color: AppColors.gray800,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.danger,
    marginTop: 6,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: AppColors.primary + '10',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: AppColors.gray700,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: AppColors.gray500,
    fontWeight: '600',
  },
});
