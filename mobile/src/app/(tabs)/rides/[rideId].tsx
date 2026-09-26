import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { scheduledRideFixtures } from '../../../prototypeData/fixtures';
import { ScheduledRideDetailScreen } from '../../../screens/ScheduledRideDetailScreen';

export default function ScheduledRideDetailRoute() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>();
  const ride = scheduledRideFixtures.find((fixture) => fixture.id === rideId);

  if (!ride) {
    return <Redirect href="/rides" />;
  }

  return (
    <ScheduledRideDetailScreen
      onBack={() => router.back()}
      // Switches to the Inbox tab with the inbox kept underneath the conversation.
      onMessageDriver={(chatId) => router.navigate(`/inbox/${chatId}`, { withAnchor: true })}
      ride={ride}
    />
  );
}
