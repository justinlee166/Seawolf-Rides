import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../theme';

interface RoutePlaceholderProps {
  nodes: readonly string[];
  label?: string;
}

export function RoutePlaceholder({ nodes, label = 'Route summary' }: RoutePlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {nodes.map((node, index) => (
        <View key={`${node}-${index}`}>
          <View style={styles.nodeRow}>
            <View style={[styles.dot, index === nodes.length - 1 && styles.destinationDot]} />
            <Text style={styles.nodeText}>{node}</Text>
          </View>
          {index < nodes.length - 1 && <View style={styles.line} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
  },
  nodeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  dot: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: radii.pill,
    borderWidth: 3,
    height: 14,
    width: 14,
  },
  destinationDot: {
    backgroundColor: colors.accent,
  },
  nodeText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  line: {
    backgroundColor: colors.accent,
    height: 24,
    marginLeft: 6,
    marginVertical: 3,
    width: 2,
  },
});
