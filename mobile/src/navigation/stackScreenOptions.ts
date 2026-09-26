import { colors } from '../theme';

// Screens draw their own titles and back buttons, so the native header stays hidden.
// The native stack still provides swipe-back, the Android back button, and transitions.
export const stackScreenOptions = {
  contentStyle: { backgroundColor: colors.background },
  headerShown: false,
} as const;
