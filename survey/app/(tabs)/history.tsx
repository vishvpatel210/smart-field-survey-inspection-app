import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import { useSurvey } from '@/contexts/SurveyContext';
import { AppColors } from '@/constants/theme';
import { Priority } from '@/types/survey';

type FilterType = 'All' | Priority;

const filters: FilterType[] = ['All', 'High', 'Medium', 'Low'];

const priorityColors: Record<Priority, string> = {
  High: AppColors.priorityHigh,
  Medium: AppColors.priorityMedium,
  Low: AppColors.priorityLow,
};

export default function HistoryScreen() {
  const { surveys, deleteSurvey } = useSurvey();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [refreshing, setRefreshing] = useState(false);

  const filteredSurveys = useMemo(() => {
    let result = surveys;

    if (activeFilter !== 'All') {
      result = result.filter((s) => s.priority === activeFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.siteName.toLowerCase().includes(query) ||
          s.clientName.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query)
      );
    }

    return result;
  }, [surveys, activeFilter, search]);

  const handleDelete = (id: string, siteName: string) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete "${siteName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSurvey(id);
            Alert.alert('Deleted', 'Survey has been deleted.');
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const renderSurveyItem = ({ item }: { item: typeof surveys[0] }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push({ pathname: '/survey-preview', params: { id: item.id } })}
      onLongPress={() => handleDelete(item.id, item.siteName)}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardInfo}>
          <Text style={styles.surveyId}>{item.id}</Text>
          <Text style={styles.siteName} numberOfLines={1}>{item.siteName}</Text>
          <Text style={styles.clientName} numberOfLines={1}>{item.clientName}</Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '15' }]}>
            <Ionicons name="flag" size={12} color={priorityColors[item.priority]} />
            <Text style={[styles.priorityText, { color: priorityColors[item.priority] }]}>
              {item.priority}
            </Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'submitted' ? styles.statusSubmitted : styles.statusDraft]}>
            <Text style={[styles.statusText, item.status === 'submitted' ? styles.statusSubmittedText : styles.statusDraftText]}>
              {item.status === 'submitted' ? 'Submitted' : 'Draft'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottom}>
        <View style={styles.cardBottomLeft}>
          <Ionicons name="time-outline" size={14} color={AppColors.gray400} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.cardBottomRight}>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            onPress={() => router.push({ pathname: '/survey-preview', params: { id: item.id } })}
          >
            <Ionicons name="eye-outline" size={18} color={AppColors.primary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.iconBtn, styles.deleteBtn, pressed && styles.iconBtnPressed]}
            onPress={() => handleDelete(item.id, item.siteName)}
          >
            <Ionicons name="trash-outline" size={18} color={AppColors.danger} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Survey History" subtitle={`${filteredSurveys.length} of ${surveys.length}`} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={AppColors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, client, or ID..."
            placeholderTextColor={AppColors.gray400}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={AppColors.gray400} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <Pressable
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
              f !== 'All' && activeFilter === f && { backgroundColor: priorityColors[f] },
            ]}
            onPress={() => setActiveFilter(f)}
          >
            {f !== 'All' && (
              <View style={[styles.filterDot, { backgroundColor: activeFilter === f ? AppColors.white : priorityColors[f] }]} />
            )}
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {filteredSurveys.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={AppColors.gray300} />
          <Text style={styles.emptyTitle}>No Surveys Found</Text>
          <Text style={styles.emptyText}>
            {search ? `No results for "${search}"` : 'No surveys match this filter'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item.id}
          renderItem={renderSurveyItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
  },
  filterChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.gray600,
  },
  filterTextActive: {
    color: AppColors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.gray600,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray400,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  surveyId: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
    marginBottom: 4,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  clientName: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 3,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusSubmitted: {
    backgroundColor: AppColors.success + '15',
  },
  statusDraft: {
    backgroundColor: AppColors.accent + '15',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusSubmittedText: {
    color: AppColors.success,
  },
  statusDraftText: {
    color: AppColors.accent,
  },
  cardDivider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginVertical: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: AppColors.gray400,
  },
  cardBottomRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: AppColors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: AppColors.danger + '08',
  },
  iconBtnPressed: {
    opacity: 0.6,
  },
});
