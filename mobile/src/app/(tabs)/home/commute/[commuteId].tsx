import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { commuterResultFixtures } from '../../../../prototypeData/fixtures';
import { useRideRequests } from '../../../../prototypeData/RideRequestsProvider';
import { MatchDetailScreen } from '../../../../screens/MatchDetailScreen';

export default function MatchDetailRoute() {
  const { commuteId } = useLocalSearchParams<{ commuteId: string }>();
  const { requestedCommuteIds, requestRide } = useRideRequests();
  const commute = commuterResultFixtures.find((fixture) => fixture.id === commuteId);

  if (!commute) {
    return <Redirect href="/home" />;
  }

  return (
    <MatchDetailScreen
      commute={commute}
      onBack={() => router.back()}
      onRequestRide={() => requestRide(commute.id)}
      requestSent={requestedCommuteIds.includes(commute.id)}
    />
  );
}
