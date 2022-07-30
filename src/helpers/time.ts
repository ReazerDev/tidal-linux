export function secondsFromHMS(hms: string): number {
  if (!hms || hms === '') return 0;
  const [hours, minutes, seconds] = hms.split(':');
  return (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
}
