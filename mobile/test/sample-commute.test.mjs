import assert from 'node:assert/strict';
import test from 'node:test';

import {
  mapSampleCommute,
  toSampleCommuteViewModel,
} from '../src/commutes/sampleCommute.ts';

const firestoreData = {
  role: 'driver',
  approximateArea: 'Flushing, Queens',
  recurringDays: ['Monday', 'Wednesday', 'Friday'],
  timePreference: 'Depart around 8:00 AM',
};

test('maps valid Firestore data into the sample commute view model', () => {
  const commute = mapSampleCommute(firestoreData);

  assert.deepEqual(toSampleCommuteViewModel(commute), {
    role: 'Driver',
    approximateArea: 'Flushing, Queens',
    recurringDays: 'Monday, Wednesday, Friday',
    timePreference: 'Depart around 8:00 AM',
  });
});

test('rejects an incomplete sample commute document', () => {
  assert.throws(
    () => mapSampleCommute({ ...firestoreData, recurringDays: [] }),
    /missing required fields/,
  );
});
