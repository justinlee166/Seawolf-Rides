import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { stackScreenOptions } from '../../navigation/stackScreenOptions';
import { colors } from '../../theme';

export default function AuthLayout() {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <Stack screenOptions={stackScreenOptions} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
