export const generateWalletId = (): string => {
  const chars = '0123456789abcdef';
  let walletId = '0x';
  for (let i = 0; i < 40; i++) {
    walletId += chars[Math.floor(Math.random() * chars.length)];
  }
  return walletId;
};

export const generateProductId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateQRCode = (productId: string): string => {
  return `AGRI-${productId.toUpperCase()}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
