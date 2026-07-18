import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

type FormDatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDisplay(month: number, day: number, year: number) {
  return `${MONTHS[month]} ${day}, ${year}`;
}

export default function FormDatePicker({ label, value, onChange, error, required }: FormDatePickerProps) {
  const [visible, setVisible] = useState(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const handleConfirm = () => {
    onChange(formatDisplay(selectedMonth, selectedDay, selectedYear));
    setVisible(false);
  };

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
          <Ionicons name="calendar-outline" size={20} color={AppColors.gray400} />
          <Text style={[styles.selectorText, !value && styles.placeholder]}>
            {value || 'Select date'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={AppColors.gray400} />
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Select Date</Text>

            <View style={styles.pickerRow}>
              <View style={styles.pickerCol}>
                <Text style={styles.pickerLabel}>Month</Text>
                <View style={styles.chipContainer}>
                  {MONTHS.map((m, i) => (
                    <Pressable
                      key={m}
                      style={[styles.chip, selectedMonth === i && styles.chipSelected]}
                      onPress={() => {
                        setSelectedMonth(i);
                        const maxDays = getDaysInMonth(selectedYear, i);
                        if (selectedDay > maxDays) setSelectedDay(maxDays);
                      }}
                    >
                      <Text style={[styles.chipText, selectedMonth === i && styles.chipTextSelected]}>
                        {m}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.pickerCol}>
                <Text style={styles.pickerLabel}>Day</Text>
                <View style={styles.chipContainer}>
                  {days.map((d) => (
                    <Pressable
                      key={d}
                      style={[styles.chip, styles.chipSmall, selectedDay === d && styles.chipSelected]}
                      onPress={() => setSelectedDay(d)}
                    >
                      <Text style={[styles.chipText, selectedDay === d && styles.chipTextSelected]}>
                        {d}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.pickerCol}>
                <Text style={styles.pickerLabel}>Year</Text>
                <View style={styles.chipContainer}>
                  {years.map((y) => (
                    <Pressable
                      key={y}
                      style={[styles.chip, styles.chipMedium, selectedYear === y && styles.chipSelected]}
                      onPress={() => {
                        setSelectedYear(y);
                        const maxDays = getDaysInMonth(y, selectedMonth);
                        if (selectedDay > maxDays) setSelectedDay(maxDays);
                      }}
                    >
                      <Text style={[styles.chipText, selectedYear === y && styles.chipTextSelected]}>
                        {y}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.previewRow}>
              <Ionicons name="calendar" size={18} color={AppColors.primary} />
              <Text style={styles.previewText}>{formatDisplay(selectedMonth, selectedDay, selectedYear)}</Text>
            </View>

            <View style={styles.buttonRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmText}>Confirm</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: AppColors.gray700, marginBottom: 8 },
  required: { color: AppColors.danger },
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
  selectorError: { borderColor: AppColors.danger, backgroundColor: AppColors.danger + '05' },
  selectorContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectorText: { fontSize: 15, color: AppColors.gray800 },
  placeholder: { color: AppColors.gray400 },
  errorText: { fontSize: 12, color: AppColors.danger, marginTop: 6, fontWeight: '500' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: AppColors.gray900, marginBottom: 20, textAlign: 'center' },
  pickerRow: { gap: 16 },
  pickerCol: {},
  pickerLabel: { fontSize: 13, fontWeight: '600', color: AppColors.gray500, marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: AppColors.gray100,
  },
  chipSmall: { paddingHorizontal: 10 },
  chipMedium: { paddingHorizontal: 14 },
  chipSelected: { backgroundColor: AppColors.primary },
  chipText: { fontSize: 13, color: AppColors.gray600, fontWeight: '500' },
  chipTextSelected: { color: AppColors.white },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: AppColors.primary + '10',
    borderRadius: 10,
  },
  previewText: { fontSize: 16, fontWeight: '700', color: AppColors.primary },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: AppColors.gray100,
  },
  cancelText: { fontSize: 16, color: AppColors.gray500, fontWeight: '600' },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: AppColors.primary,
  },
  confirmText: { fontSize: 16, color: AppColors.white, fontWeight: '700' },
});
