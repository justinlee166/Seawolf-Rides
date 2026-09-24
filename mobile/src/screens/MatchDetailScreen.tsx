import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { DetailRow } from '../components/DetailRow';
import { RoutePlaceholder } from '../components/RoutePlaceholder';
import { Screen } from '../components/Screen';
import { PrototypeCommuterResult } from '../prototypeData/types';
import { colors, radii, spacing } from '../theme';

interface MatchDetailScreenProps {
  commute: PrototypeCommuterResult;
  requestSent: boolean;
  onBack: () => void;
  onRequestRide: () => void;
}

export function MatchDetailScreen({
  commute,
  requestSent,
  onBack,
  onRequestRide,
}: MatchDetailScreenProps) {
  return (
    <Screen
      eyebrow="COMMUTE PREVIEW"
      onBack={onBack}
      subtitle={`${commute.driverRole} · ${commute.originArea}`}
      title={`${commute.driverName}'s commute`}
    >
      <Card>
        <RoutePlaceholder nodes={commute.routeStops} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Ride details</Text>
        <View style={styles.detailsGrid}>
          <DetailRow label="Estimated pickup" value={commute.pickupEstimate} />
          <DetailRow label="Estimated arrival" value={commute.arrivalEstimate} />
          <DetailRow label="Added driver detour" value={`${commute.addedDetourMinutes} min`} />
          <DetailRow label="Seats available" value={String(commute.seatsAvailable)} />
          <DetailRow label="Recurring days" value={commute.recurringDays.join(', ')} />
        </View>
      </Card>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyTitle}>Pickup privacy</Text>
        <Text style={styles.privacyText}>
          Exact pickup information would only be shared after a ride request is accepted.
        </Text>
      </View>

      <AppButton
        disabled={requestSent}
        label={requestSent ? 'Request sent' : 'Request ride'}
        onPress={onRequestRide}
      />
      <Text style={styles.prototypeNote}>
        This action updates local prototype state only and is not written to Firebase.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  detailsGrid: {
    gap: spacing.lg,
  },
  privacyNote: {
    backgroundColor: colors.warningSoft,
    borderRadius: radii.md,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  privacyTitle: {
    color: colors.warning,
    fontSize: 15,
    fontWeight: '800',
  },
  privacyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  prototypeNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});
