import { StyleSheet, Text, View } from 'react-native';

import { AuthUser } from '../auth/authService';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { colors, radii, spacing } from '../theme';

interface AccountScreenProps {
  user: AuthUser;
  onSignOut: () => void;
}

const providerLabels = {
  google: 'Signed in with Google',
  email: 'Signed in with email',
} as const;

export function AccountScreen({ user, onSignOut }: AccountScreenProps) {
  return (
    <Screen eyebrow="YOUR PROFILE" title="Account">
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.email.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text numberOfLines={1} selectable style={styles.email}>
            {user.email}
          </Text>
          <Text style={styles.provider}>{providerLabels[user.provider]}</Text>
        </View>
      </Card>

      <Text style={styles.note}>
        Your name, commute role, and vehicle details will live here once profile setup is
        added.
      </Text>

      <AppButton label="Sign out" onPress={onSignOut} variant="secondary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  avatarText: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '800',
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  email: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  provider: {
    color: colors.textMuted,
    fontSize: 13,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
});
