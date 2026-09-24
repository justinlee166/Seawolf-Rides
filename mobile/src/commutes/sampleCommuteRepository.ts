import { doc, getDoc } from 'firebase/firestore';

import { getFirebaseFirestore } from '../firebase/firebase';
import { mapSampleCommute, SampleCommute } from './sampleCommute';

const SAMPLE_COMMUTE_COLLECTION = 'commutes';
const SAMPLE_COMMUTE_DOCUMENT_ID = 'sample-commute-001';

export async function fetchSampleCommute(): Promise<SampleCommute | null> {
  const documentReference = doc(
    getFirebaseFirestore(),
    SAMPLE_COMMUTE_COLLECTION,
    SAMPLE_COMMUTE_DOCUMENT_ID,
  );
  const snapshot = await getDoc(documentReference);

  if (!snapshot.exists()) {
    return null;
  }

  return mapSampleCommute(snapshot.data());
}
