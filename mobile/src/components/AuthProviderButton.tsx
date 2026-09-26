import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../theme';

interface AuthProviderButtonProps {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AuthProviderButton({
  label,
  icon,
  onPress,
  disabled = false,
  loading = false,
}: AuthProviderButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !inactive && styles.pressed,
        disabled && !loading && styles.disabled,
      ]}
    >
      <View style={styles.icon}>
        {loading ? <ActivityIndicator color={colors.textMuted} size="small" /> : icon}
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  disabled: {
    opacity: 0.58,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
  },
  label: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
