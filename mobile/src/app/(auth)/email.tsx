import { router } from 'expo-router';

import { useSession } from '../../auth/SessionProvider';
import { EmailAuthScreen } from '../../screens/EmailAuthScreen';

export default function EmailAuthRoute() {
  const { signIn } = useSession();

  return <EmailAuthScreen onAuthenticated={signIn} onBack={() => router.back()} />;
}
