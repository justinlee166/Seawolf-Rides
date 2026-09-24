import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import {
  SampleCommuteViewModel,
  toSampleCommuteViewModel,
} from '../commutes/sampleCommute';
import { fetchSampleCommute } from '../commutes/sampleCommuteRepository';
import { colors, radii, spacing } from '../theme';
import { AppButton } from './AppButton';
import { Card } from './Card';
import { DetailRow } from './DetailRow';

type SavedCommuteState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success'; commute: SampleCommuteViewModel }
  | { status: 'empty' }
  | { status: 'error' };

export function SavedCommuteCard() {
  const [state, setState] = useState<SavedCommuteState>({ status: 'initial' });

  async function loadSavedCommute() {
    setState({ status: 'loading' });

    try {
      const commute = await fetchSampleCommute();
      if (commute === null) {
        setState({ status: 'empty' });
        return;
      }
      setState({
        status: 'success',
        commute: toSampleCommuteViewModel(commute),
      });
    } catch {
      setState({ status: 'error' });
    }
  }

  const loading = state.status === 'loading';

  return (
    <Card>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Your saved commute</Text>
          <Text style={styles.subtitle}>Loaded from the M2 Firestore document</Text>
        </View>
        <View style={styles.realBadge}>
          <Text style={styles.realBadgeText}>FIRESTORE</Text>
        </View>
      </View>

      <View style={styles.stateArea}>
        {state.status === 'initial' && (
          <Text style={styles.message}>Load the persisted sample commute when ready.</Text>
        )}

        {state.status === 'loading' && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} size="small" />
            <Text style={styles.message}>Loading saved commute…</Text>
          </View>
        )}

        {state.status === 'success' && (
          <View style={styles.details}>
            <DetailRow label="Role" value={state.commute.role} />
            <DetailRow label="Approximate area" value={state.commute.approximateArea} />
            <DetailRow label="Recurring days" value={state.commute.recurringDays} />
            <DetailRow label="Time preference" value={state.commute.timePreference} />
          </View>
        )}

        {state.status === 'empty' && (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>No saved commute found</Text>
            <Text style={styles.message}>The sample Firestore document does not exist.</Text>
          </View>
        )}

        {state.status === 'error' && (
          <View style={[styles.notice, styles.errorNotice]}>
            <Text style={[styles.noticeTitle, styles.errorText]}>Unable to load commute</Text>
            <Text style={styles.message}>
              Check the network and Firebase configuration, then try again.
            </Text>
          </View>
        )}
      </View>

      <AppButton
        disabled={loading}
        label={loading ? 'Loading…' : state.status === 'success' ? 'Refresh commute' : 'Load saved commute'}
        onPress={loadSavedCommute}
        variant="secondary"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  headingRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headingCopy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  realBadge: {
    backgroundColor: colors.successSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  realBadgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  stateArea: {
    marginVertical: spacing.lg,
    minHeight: 72,
    justifyContent: 'center',
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  details: {
    gap: spacing.md,
  },
  notice: {
    backgroundColor: colors.warningSoft,
    borderRadius: radii.sm,
    gap: spacing.xs,
    padding: spacing.md,
  },
  errorNotice: {
    backgroundColor: colors.errorSoft,
  },
  noticeTitle: {
    color: colors.warning,
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    color: colors.error,
  },
});
