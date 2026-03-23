export default async function generateUniqueInvoiceId(
  prisma: any,
): Promise<string> {
  try {
    // Fetch the latest invoice from the database
    const latestInvoice = await prisma.order_invoice.findFirst({
      orderBy: { matricule: 'desc' },
    });

    let lastNumber = 1; // Default starting number

    if (latestInvoice && latestInvoice.matricule) {
      // Regex to match the pattern FA<2-digit-year>VL<4-digit-number>
      const match = latestInvoice.matricule.match(/FA(\d{2})VL(\d{4})/);

      if (match && match[2]) {
        // Extract the number part and increment it
        lastNumber = parseInt(match[2], 10) + 1;
      } else {
        console.warn(
          `Invalid matricule format in database: ${latestInvoice.matricule}. Defaulting to lastNumber = 1.`,
        );
        throw new Error(
          `Invalid matricule format in database: ${latestInvoice.matricule}. Defaulting to lastNumber = 1.`,
        );
      }
    }

    // Get the last two digits of the current year
    const currentYear = new Date().getFullYear().toString().slice(2);

    // Generate the new matricule
    const newMatricule = `FA${currentYear}VL${lastNumber.toString().padStart(4, '0')}`;

    return newMatricule;
  } catch (error) {
    console.error('Error generating unique invoice ID:', error);
    throw new Error('Failed to generate unique invoice ID');
  }
}
