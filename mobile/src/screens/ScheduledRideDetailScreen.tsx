import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { DetailRow } from '../components/DetailRow';
import { RoutePlaceholder } from '../components/RoutePlaceholder';
import { Screen } from '../components/Screen';
import { ScheduledRide } from '../prototypeData/types';
import { colors, radii, spacing } from '../theme';

interface ScheduledRideDetailScreenProps {
  ride: ScheduledRide;
  onBack: () => void;
  onMessageDriver: (chatId: string) => void;
}

export function ScheduledRideDetailScreen({
  ride,
  onBack,
  onMessageDriver,
}: ScheduledRideDetailScreenProps) {
  return (
    <Screen
      eyebrow="SCHEDULED RIDE"
      onBack={onBack}
      subtitle={`${ride.origin} → ${ride.destination}`}
      title={ride.dateLabel}
    >
      <Card>
        <View style={styles.details}>
          <DetailRow label="Driver" value={ride.driverName} />
          <DetailRow label="Rider" value={ride.riderName} />
          <DetailRow label="Pickup time" value={ride.pickupTime} />
          <DetailRow label="Expected arrival" value={ride.expectedArrival} />
          <DetailRow label="Origin" value={ride.origin} />
          <DetailRow label="Destination" value={ride.destination} />
        </View>
      </Card>

      <Card>
        <RoutePlaceholder label="Route placeholder" nodes={ride.routeStops} />
      </Card>

      <View style={styles.liveCard}>
        <Text style={styles.liveTitle}>Live trip information</Text>
        <Text style={styles.liveText}>
          Routing and live traffic will be connected in a later milestone.
        </Text>
      </View>

      <AppButton
        label={`Message ${ride.driverName}`}
        onPress={() => onMessageDriver(ride.chatId)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  details: {
    gap: spacing.lg,
  },
  liveCard: {
    backgroundColor: colors.warningSoft,
    borderRadius: radii.md,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  liveTitle: {
    color: colors.warning,
    fontSize: 16,
    fontWeight: '800',
  },
  liveText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
