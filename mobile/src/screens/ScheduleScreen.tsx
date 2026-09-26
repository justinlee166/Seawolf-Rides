import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { PrototypeCommuterResult, ScheduledRide } from '../prototypeData/types';
import { colors, radii, spacing } from '../theme';

interface ScheduleScreenProps {
  rides: ScheduledRide[];
  pendingRequests: PrototypeCommuterResult[];
  onViewRide: (id: string) => void;
}

export function ScheduleScreen({ rides, pendingRequests, onViewRide }: ScheduleScreenProps) {
  return (
    <Screen
      eyebrow="YOUR SCHEDULE"
      subtitle="Requests waiting on a driver and the carpools you have planned."
      title="Rides"
    >
      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Requests
          </Text>
          {pendingRequests.map((request) => (
            <Card key={request.id} style={styles.requestCard}>
              <View style={styles.requestCopy}>
                <Text style={styles.requestDriver}>{request.driverName}</Text>
                <Text style={styles.requestRoute}>
                  {request.originArea} → {request.destination}
                </Text>
                <Text style={styles.requestMeta}>
                  Pickup {request.pickupEstimate} · {request.recurringDays.join(', ')}
                </Text>
              </View>
              <View style={styles.pendingPill}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      <Text accessibilityRole="header" style={styles.sectionTitle}>
        Upcoming
      </Text>
      {rides.map((ride) => (
        <Card key={ride.id}>
          <View style={styles.dateRow}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>{ride.day.slice(0, 3).toUpperCase()}</Text>
            </View>
            <View style={styles.timeCopy}>
              <Text style={styles.time}>{ride.pickupTime}</Text>
              <Text style={styles.date}>{ride.dateLabel}</Text>
            </View>
          </View>

          <Text style={styles.route}>{ride.origin} → Stony Brook</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Driver: {ride.driverName}</Text>
            <Text style={styles.meta}>Arrival: {ride.expectedArrival}</Text>
          </View>

          <AppButton
            label="View ride"
            onPress={() => onViewRide(ride.id)}
            variant="secondary"
          />
        </Card>
      ))}

      <Text style={styles.fixtureNote}>
        Upcoming rides are local M2 fixtures and are not synchronized with Firebase.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  requestCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  requestCopy: {
    flex: 1,
    gap: 2,
  },
  requestDriver: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  requestRoute: {
    color: colors.text,
    fontSize: 14,
  },
  requestMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  pendingPill: {
    backgroundColor: colors.warningSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  pendingText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '800',
  },
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  dayBadge: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 54,
  },
  dayText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  timeCopy: {
    flex: 1,
  },
  time: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  date: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  route: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  metaRow: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    gap: spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  fixtureNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
});
