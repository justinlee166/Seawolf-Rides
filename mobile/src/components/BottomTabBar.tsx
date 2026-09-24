import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export type MainTab = 'match' | 'schedule' | 'chats';

interface BottomTabBarProps {
  activeTab: MainTab;
  onSelect: (tab: MainTab) => void;
}

const tabs: { id: MainTab; label: string }[] = [
  { id: 'match', label: 'Match' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'chats', label: 'Chats' },
];

export function BottomTabBar({ activeTab, onSelect }: BottomTabBarProps) {
  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <View style={[styles.indicator, active && styles.indicatorActive]} />
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  tabPressed: {
    opacity: 0.62,
  },
  indicator: {
    backgroundColor: 'transparent',
    borderRadius: 2,
    height: 3,
    marginBottom: spacing.sm,
    width: 30,
  },
  indicatorActive: {
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '800',
  },
});
