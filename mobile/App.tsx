import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SampleCommuteViewModel,
  toSampleCommuteViewModel,
} from './src/commutes/sampleCommute';
import { fetchSampleCommute } from './src/commutes/sampleCommuteRepository';

type LoadState =
  | { status: 'initial' }
  | { status: 'loading' }
  | { status: 'success'; commute: SampleCommuteViewModel }
  | { status: 'empty' }
  | { status: 'error' };

const initialState: LoadState = { status: 'initial' };

export default function App() {
  const [loadState, setLoadState] = useState<LoadState>(initialState);

  async function loadSampleCommute() {
    setLoadState({ status: 'loading' });

    try {
      const commute = await fetchSampleCommute();

      if (commute === null) {
        setLoadState({ status: 'empty' });
        return;
      }

      setLoadState({
        status: 'success',
        commute: toSampleCommuteViewModel(commute),
      });
    } catch {
      setLoadState({ status: 'error' });
    }
  }

  const isLoading = loadState.status === 'loading';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SEAWOLF RIDES</Text>
          <Text style={styles.title}>M2 Firestore Prototype</Text>
          <Text style={styles.subtitle}>
            Load one persisted commute to verify the mobile and Firestore connection.
          </Text>
        </View>

        <View style={styles.panel}>
          {loadState.status === 'initial' && (
            <Text style={styles.message}>
              The sample commute has not been loaded yet.
            </Text>
          )}

          {loadState.status === 'loading' && (
            <View style={styles.loading}>
              <ActivityIndicator color="#990000" size="small" />
              <Text style={styles.message}>Loading sample commute…</Text>
            </View>
          )}

          {loadState.status === 'success' && (
            <View style={styles.details}>
              <CommuteDetail label="Role" value={loadState.commute.role} />
              <CommuteDetail
                label="Approximate area"
                value={loadState.commute.approximateArea}
              />
              <CommuteDetail
                label="Recurring days"
                value={loadState.commute.recurringDays}
              />
              <CommuteDetail
                label="Time preference"
                value={loadState.commute.timePreference}
              />
            </View>
          )}

          {loadState.status === 'empty' && (
            <Text style={styles.message}>
              The sample commute document was not found.
            </Text>
          )}

          {loadState.status === 'error' && (
            <Text style={styles.errorMessage}>
              The sample commute could not be loaded. Check the connection and
              Firebase configuration, then try again.
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={loadSampleCommute}
          style={({ pressed }) => [
            styles.button,
            pressed && !isLoading && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading…' : 'Load sample commute'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

interface CommuteDetailProps {
  label: string;
  value: string;
}

function CommuteDetail({ label, value }: CommuteDetailProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    color: '#990000',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: '#17212b',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  subtitle: {
    color: '#55616d',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderColor: '#dce1e5',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 150,
    padding: 20,
    justifyContent: 'center',
  },
  loading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  message: {
    color: '#55616d',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#9a251d',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  details: {
    gap: 16,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    color: '#6b7580',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#17212b',
    fontSize: 17,
    lineHeight: 24,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#990000',
    borderRadius: 10,
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonPressed: {
    backgroundColor: '#760000',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
