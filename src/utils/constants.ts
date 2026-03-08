const APP_NAME = "Counter";
const MAX_COUNTERS = 5;

export type NotificationInterval = 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly';

export const NOTIFICATION_INTERVALS: { label: string; value: NotificationInterval; ms: number }[] = [
  { label: 'None', value: 'none', ms: 0 },
  { label: 'Every Hour', value: 'hourly', ms: 60 * 60 * 1000 },
  { label: 'Every Day', value: 'daily', ms: 24 * 60 * 60 * 1000 },
  { label: 'Every Week', value: 'weekly', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: 'Every Month', value: 'monthly', ms: 30 * 24 * 60 * 60 * 1000 },
];

export { APP_NAME, MAX_COUNTERS };
