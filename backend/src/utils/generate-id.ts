// backend/src/utils/generate-id.ts
export default async function generateCustomTrackingID(user: any, prefix?: string): Promise<string> {
  const now = new Date();
  
  // Déterminer le préfixe selon le rôle
  let trackingPrefix = prefix || 'SL'; // SAM Logistic par défaut
  
  if (user?.roleId === 1) {
    trackingPrefix = 'ADM'; // Admin
  } else if (user?.roleId === 2) {
    trackingPrefix = 'TRP'; // Transporter
  } else if (user?.roleId === 3) {
    trackingPrefix = 'CLT'; // Client
  }
  
  // Format: PREFIX-YYMMDD-USERID-RANDOM
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const userId = String(user?.id || 0).padStart(4, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `${trackingPrefix}-${year}${month}${day}-${userId}-${random}`;
}
