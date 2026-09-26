import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AuthUser, registerWithEmail, signInWithEmail } from '../auth/authService';
import {
  AuthMode,
  CredentialErrors,
  hasCredentialErrors,
  MIN_PASSWORD_LENGTH,
  validateCredentials,
} from '../auth/authValidation';
import { AppButton } from '../components/AppButton';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { colors, radii, spacing } from '../theme';

interface EmailAuthScreenProps {
  onBack: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

const modeCopy = {
  signIn: {
    title: 'Welcome back',
    subtitle: 'Sign in with your Stony Brook email.',
    submit: 'Sign in',
    pending: 'Signing in…',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Your @stonybrook.edu email keeps every ride within the campus community.',
    submit: 'Create account',
    pending: 'Creating account…',
  },
} as const;

const modeOptions: { mode: AuthMode; label: string }[] = [
  { mode: 'signIn', label: 'Sign in' },
  { mode: 'register', label: 'Create account' },
];

export function EmailAuthScreen({ onBack, onAuthenticated }: EmailAuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<CredentialErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const copy = modeCopy[mode];

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setFormError(null);
  }

  async function submit() {
    const credentials = { email, password };
    const nextErrors = validateCredentials(mode, credentials);
    setErrors(nextErrors);
    setFormError(null);

    if (hasCredentialErrors(nextErrors)) {
      return;
    }

    setSubmitting(true);
    try {
      const authenticate = mode === 'signIn' ? signInWithEmail : registerWithEmail;
      onAuthenticated(await authenticate(credentials));
    } catch {
      setSubmitting(false);
      setFormError(
        mode === 'signIn'
          ? 'We couldn’t sign you in. Check your email and password and try again.'
          : 'We couldn’t create your account. Try again in a moment.',
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <Screen onBack={submitting ? undefined : onBack} subtitle={copy.subtitle} title={copy.title}>
        <View accessibilityRole="tablist" style={styles.modeSwitch}>
          {modeOptions.map((option) => {
            const selected = option.mode === mode;
            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected, disabled: submitting }}
                disabled={submitting}
                key={option.mode}
                onPress={() => changeMode(option.mode)}
                style={[styles.modeOption, selected && styles.modeOptionSelected]}
              >
                <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextField
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          editable={!submitting}
          error={errors.email}
          inputMode="email"
          keyboardType="email-address"
          label="Stony Brook email"
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="netid@stonybrook.edu"
          returnKeyType="next"
          submitBehavior="submit"
          textContentType="username"
          value={email}
        />

        <TextField
          accessory={
            <Pressable
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => setPasswordVisible((visible) => !visible)}
            >
              <Ionicons
                color={colors.textMuted}
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={22}
              />
            </Pressable>
          }
          autoCapitalize="none"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          autoCorrect={false}
          editable={!submitting}
          error={errors.password}
          helperText={
            mode === 'register' ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined
          }
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          onSubmitEditing={submit}
          ref={passwordRef}
          returnKeyType="go"
          secureTextEntry={!passwordVisible}
          textContentType={mode === 'register' ? 'newPassword' : 'password'}
          value={password}
        />

        {mode === 'signIn' && (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() =>
              Alert.alert(
                'Reset password',
                'Password reset isn’t available in the M2 prototype yet.',
              )
            }
            style={({ pressed }) => [styles.forgotLink, pressed && styles.linkPressed]}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>
        )}

        {formError && (
          <View accessibilityLiveRegion="polite" style={styles.formError}>
            <Ionicons color={colors.error} name="alert-circle-outline" size={20} />
            <Text style={styles.formErrorText}>{formError}</Text>
          </View>
        )}

        <AppButton
          disabled={submitting}
          label={submitting ? copy.pending : copy.submit}
          onPress={submit}
        />

        {mode === 'register' && (
          <Text style={styles.nextStep}>
            Next, you’ll set up your profile and choose whether you’re driving, riding, or both.
          </Text>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  modeSwitch: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  modeOption: {
    alignItems: 'center',
    borderRadius: radii.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  modeOptionSelected: {
    backgroundColor: colors.surface,
    shadowColor: '#17212b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  modeLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  modeLabelSelected: {
    color: colors.text,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    minHeight: 32,
    justifyContent: 'center',
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  formError: {
    alignItems: 'flex-start',
    backgroundColor: colors.errorSoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  formErrorText: {
    color: colors.error,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  nextStep: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
