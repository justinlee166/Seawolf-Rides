import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { PrototypeCommuterResult } from '../prototypeData/types';
import { colors, radii, spacing } from '../theme';

interface MatchResultsScreenProps {
  results: PrototypeCommuterResult[];
  onBack: () => void;
  onViewCommute: (id: string) => void;
}

export function MatchResultsScreen({
  results,
  onBack,
  onViewCommute,
}: MatchResultsScreenProps) {
  return (
    <Screen
      eyebrow="DEMO RECOMMENDATIONS"
      onBack={onBack}
      subtitle="These local fixtures preview how compatible drivers may be presented."
      title="Commuters for Monday"
    >
      {results.map((result) => (
        <Card key={result.id}>
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{result.driverName.charAt(0)}</Text>
            </View>
            <View style={styles.driverCopy}>
              <Text style={styles.driverName}>{result.driverName}</Text>
              <Text style={styles.origin}>{result.originArea}</Text>
            </View>
            <Text style={styles.seats}>{result.seatsAvailable} seat{result.seatsAvailable === 1 ? '' : 's'}</Text>
          </View>

          <Text style={styles.destination}>To {result.destination}</Text>
          <View style={styles.stats}>
            <Stat label="Pickup" value={result.pickupEstimate} />
            <Stat label="Arrival" value={result.arrivalEstimate} />
            <Stat label="Added detour" value={`${result.addedDetourMinutes} min`} />
          </View>

          <AppButton
            accessibilityLabel={`View ${result.driverName}'s commute`}
            label="View commute"
            onPress={() => onViewCommute(result.id)}
            variant="secondary"
          />
        </Card>
      ))}
    </Screen>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  driverRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    height: 46,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 46,
  },
  avatarText: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: '800',
  },
  driverCopy: {
    flex: 1,
  },
  driverName: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  origin: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  seats: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '700',
  },
  destination: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  stats: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
});
