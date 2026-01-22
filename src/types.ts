export type UserRole = 'farmer' | 'transporter' | 'retailer' | 'consumer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletId: string;
}

export interface Product {
  id: string;
  farmerId: string;
  productName: string;
  quantity: number;
  price: number;
  qrCode: string;
  status: 'created' | 'in_transport' | 'at_retail' | 'sold';
  createdAt: string;
  farmerName?: string;
}

export interface TransportLog {
  id: string;
  productId: string;
  transporterId: string;
  transportDetails: string;
  transportCost: number;
  updatedAt: string;
  transporterName?: string;
}

export interface RetailLog {
  id: string;
  productId: string;
  retailerId: string;
  retailPrice: number;
  location: string;
  updatedAt: string;
  retailerName?: string;
}

export interface ProductJourney {
  product: Product;
  transportLog?: TransportLog;
  retailLog?: RetailLog;
}

export interface ApprovalRequest {
  id: string;
  productId: string;
  productName: string;
  requesterId: string;
  requesterName: string;
  requesterRole: 'transporter' | 'retailer';
  approverId: string;
  approverRole: 'farmer' | 'transporter';
  status: 'pending' | 'approved' | 'rejected';
  requestData: TransportLog | RetailLog;
  createdAt: string;
  updatedAt: string;
}
