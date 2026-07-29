export const generateEtiquette = (orderId: string) => {
  const token = localStorage.getItem('accessToken');
  fetch(`${import.meta.env.VITE_BASE_URL}/generate-pdf/etiquette-commande`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'etiquette.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error('Failed to generate etiquette:', err);
    });
};
export const generateProviderFacture = async (id: string, from: string, to: string, invoiceType: number) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/generate-provider-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id, from, to, invoiceType }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${invoiceType === 3 ? 'client' : 'transporteur'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to generate invoice:', err);
  }
};
