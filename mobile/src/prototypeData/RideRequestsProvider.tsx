import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

interface RideRequests {
  requestedCommuteIds: string[];
  requestRide: (commuteId: string) => void;
}

const RideRequestsContext = createContext<RideRequests | null>(null);

// Frontend-only M2 state. No request is sent to Firebase.
export function RideRequestsProvider({ children }: PropsWithChildren) {
  const [requestedCommuteIds, setRequestedCommuteIds] = useState<string[]>([]);

  const rideRequests = useMemo<RideRequests>(
    () => ({
      requestedCommuteIds,
      requestRide: (commuteId) =>
        setRequestedCommuteIds((current) =>
          current.includes(commuteId) ? current : [...current, commuteId],
        ),
    }),
    [requestedCommuteIds],
  );

  return (
    <RideRequestsContext.Provider value={rideRequests}>{children}</RideRequestsContext.Provider>
  );
}

export function useRideRequests(): RideRequests {
  const rideRequests = useContext(RideRequestsContext);
  if (!rideRequests) {
    throw new Error('useRideRequests must be used within a RideRequestsProvider');
  }
  return rideRequests;
}
