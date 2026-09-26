import { useSession } from '../../../auth/SessionProvider';
import { AccountScreen } from '../../../screens/AccountScreen';

export default function AccountRoute() {
  const { user, signOut } = useSession();

  // The (tabs) group is only reachable while signed in.
  if (!user) {
    return null;
  }

  return <AccountScreen onSignOut={signOut} user={user} />;
}
