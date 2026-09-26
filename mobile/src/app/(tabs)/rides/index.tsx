import { router } from 'expo-router';

import { commuterResultFixtures, scheduledRideFixtures } from '../../../prototypeData/fixtures';
import { useRideRequests } from '../../../prototypeData/RideRequestsProvider';
import { ScheduleScreen } from '../../../screens/ScheduleScreen';

export default function RidesRoute() {
  const { requestedCommuteIds } = useRideRequests();
  const pendingRequests = commuterResultFixtures.filter((commute) =>
    requestedCommuteIds.includes(commute.id),
  );

  return (
    <ScheduleScreen
      onViewRide={(rideId) => router.push(`/rides/${rideId}`)}
      pendingRequests={pendingRequests}
      rides={scheduledRideFixtures}
    />
  );
}
