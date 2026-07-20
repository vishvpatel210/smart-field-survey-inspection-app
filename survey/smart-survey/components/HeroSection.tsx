import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, AppShadows } from '@/constants/theme';

type HeroSectionProps = {
  name: string;
  date: string;
  progressPercent: number;
};

export default function HeroSection({ name, date, progressPercent }: HeroSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5)  return { text: 'Good Night',     emoji: '🌙' };
    if (hour < 12) return { text: 'Good Morning',   emoji: '☀️' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '⛅' };
    if (hour < 21) return { text: 'Good Evening',   emoji: '🌆' };
    return           { text: 'Good Night',           emoji: '🌙' };
  };

  const getMotivation = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Let's make today count!";
    if (hour < 17) return 'Keep up the great work!';
    return "Almost done — finish strong!";
  };

  const { text: greetText, emoji } = getGreeting();

  // Build initials from first 2 words
  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const firstName = name.trim().split(' ')[0];

  return (
    <View style={styles.card}>

      {/* ── TOP ROW: avatar · greeting · date chip ── */}
      <View style={styles.topRow}>

        {/* Avatar with ring */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        </View>

        {/* Greeting text block */}
        <View style={styles.greetBlock}>
          <View style={styles.greetingRow}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.greetText}>{greetText}</Text>
          </View>
          <Text style={styles.nameText} numberOfLines={1}>{firstName}</Text>
          <Text style={styles.motivationText}>{getMotivation()}</Text>
        </View>

        {/* Date chip */}
        <View style={styles.dateChip}>
          <Ionicons name="calendar" size={11} color={AppColors.white} />
          <Text style={styles.dateChipText}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
      </View>

      {/* ── DIVIDER ── */}
      <View style={styles.divider} />

      {/* ── STATS STRIP ── */}
      <View style={styles.statsStrip}>

        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: AppColors.primaryLight }]} />
          <Text style={styles.statValue}>{progressPercent}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>

        <View style={styles.statSep} />

        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: AppColors.success }]} />
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>

        <View style={styles.statSep} />

        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: AppColors.warning }]} />
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>

        <View style={styles.statSep} />

        {/* Inline mini progress bar */}
        <View style={styles.progressBarWrap}>
          <Text style={styles.progressBarLabel}>Today</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` as any }]} />
          </View>
          <Text style={styles.progressBarPct}>{progressPercent}%</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
    backgroundColor: AppColors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.gray200 + '60',
    ...AppShadows.lg,
  },

  /* TOP ROW */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },

  /* Avatar */
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    borderColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.primaryLight + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.primaryLight,
    letterSpacing: 0.5,
  },

  /* Greeting */
  greetBlock: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  emoji: {
    fontSize: 14,
  },
  greetText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.gray500,
    letterSpacing: 0.2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '900',
    color: AppColors.gray900,
    letterSpacing: -0.8,
    lineHeight: 28,
  },
  motivationText: {
    fontSize: 12,
    color: AppColors.primaryLight,
    fontWeight: '500',
    marginTop: 3,
  },

  /* Date chip */
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppColors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.white,
    letterSpacing: 0.3,
  },

  /* DIVIDER */
  divider: {
    height: 1,
    backgroundColor: AppColors.gray100,
    marginHorizontal: 18,
  },

  /* STATS STRIP */
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: AppColors.gray900,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: AppColors.gray400,
    fontWeight: '500',
    marginTop: 1,
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: AppColors.gray100,
    marginHorizontal: 6,
  },

  /* Mini progress bar */
  progressBarWrap: {
    flex: 2,
    paddingLeft: 8,
    gap: 4,
  },
  progressBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.gray500,
  },
  progressBarBg: {
    height: 7,
    backgroundColor: AppColors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AppColors.primaryLight,
    borderRadius: 4,
  },
  progressBarPct: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.primaryLight,
  },
});
