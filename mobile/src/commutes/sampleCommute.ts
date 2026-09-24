export interface SampleCommute {
  role: 'driver' | 'rider';
  approximateArea: string;
  recurringDays: string[];
  timePreference: string;
}

export interface SampleCommuteViewModel {
  role: string;
  approximateArea: string;
  recurringDays: string;
  timePreference: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function mapSampleCommute(data: unknown): SampleCommute {
  if (!isRecord(data)) {
    throw new Error('The sample commute data is not an object.');
  }

  const { role, approximateArea, recurringDays, timePreference } = data;
  const hasValidRole = role === 'driver' || role === 'rider';
  const hasValidDays =
    Array.isArray(recurringDays) &&
    recurringDays.length > 0 &&
    recurringDays.every(isNonEmptyString);

  if (
    !hasValidRole ||
    !isNonEmptyString(approximateArea) ||
    !hasValidDays ||
    !isNonEmptyString(timePreference)
  ) {
    throw new Error('The sample commute document is missing required fields.');
  }

  return {
    role,
    approximateArea,
    recurringDays,
    timePreference,
  };
}

export function toSampleCommuteViewModel(
  commute: SampleCommute,
): SampleCommuteViewModel {
  return {
    role: commute.role.charAt(0).toUpperCase() + commute.role.slice(1),
    approximateArea: commute.approximateArea,
    recurringDays: commute.recurringDays.join(', '),
    timePreference: commute.timePreference,
  };
}
