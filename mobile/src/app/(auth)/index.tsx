import { router } from 'expo-router';

import { useSession } from '../../auth/SessionProvider';
import { WelcomeScreen } from '../../screens/WelcomeScreen';

export default function WelcomeRoute() {
  const { signIn } = useSession();

  return (
    <WelcomeScreen
      onAuthenticated={signIn}
      onContinueWithEmail={() => router.push('/email')}
    />
  );
}
