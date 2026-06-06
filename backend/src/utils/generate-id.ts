// backend/src/utils/generate-id.ts
export default function generateCustomTrackingID(user: any, sequence: number, date = new Date()): string {
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const userId = String(user?.id || 0).padStart(4, '0');
  const parcelNumber = String(sequence).padStart(5, '0');

  return `SL${userId}-${year}${month}${day}-${parcelNumber}`;
}
