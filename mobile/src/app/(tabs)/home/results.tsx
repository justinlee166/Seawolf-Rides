import { router } from 'expo-router';

import { commuterResultFixtures } from '../../../prototypeData/fixtures';
import { MatchResultsScreen } from '../../../screens/MatchResultsScreen';

export default function MatchResultsRoute() {
  return (
    <MatchResultsScreen
      onBack={() => router.back()}
      onViewCommute={(commuteId) => router.push(`/home/commute/${commuteId}`)}
      results={commuterResultFixtures}
    />
  );
}
