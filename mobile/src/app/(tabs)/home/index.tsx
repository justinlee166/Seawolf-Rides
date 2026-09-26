import { router } from 'expo-router';

import { MatchScreen } from '../../../screens/MatchScreen';

export default function MatchRoute() {
  return <MatchScreen onFindCommuters={() => router.push('/home/results')} />;
}
