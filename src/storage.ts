import { User, Product, TransportLog, RetailLog, ApprovalRequest } from './types';

const STORAGE_KEYS = {
  USERS: 'agrichain_users',
  PRODUCTS: 'agrichain_products',
  TRANSPORT_LOGS: 'agrichain_transport_logs',
  RETAIL_LOGS: 'agrichain_retail_logs',
  CURRENT_USER: 'agrichain_current_user',
  APPROVAL_REQUESTS: 'agrichain_approval_requests',
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const findUserByEmailAndRole = (email: string, role: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email && u.role === role);
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const getProductByQRCode = (qrCode: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.qrCode === qrCode);
};

export const updateProductStatus = (productId: string, status: Product['status']): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index].status = status;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

export const saveTransportLog = (log: TransportLog): void => {
  const logs = getTransportLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEYS.TRANSPORT_LOGS, JSON.stringify(logs));
};

export const getTransportLogs = (): TransportLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSPORT_LOGS);
  return data ? JSON.parse(data) : [];
};

export const getTransportLogByProductId = (productId: string): TransportLog | undefined => {
  const logs = getTransportLogs();
  return logs.find(l => l.productId === productId);
};

export const saveRetailLog = (log: RetailLog): void => {
  const logs = getRetailLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEYS.RETAIL_LOGS, JSON.stringify(logs));
};

export const getRetailLogs = (): RetailLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RETAIL_LOGS);
  return data ? JSON.parse(data) : [];
};

export const getRetailLogByProductId = (productId: string): RetailLog | undefined => {
  const logs = getRetailLogs();
  return logs.find(l => l.productId === productId);
};

export const saveApprovalRequest = (request: ApprovalRequest): void => {
  const requests = getApprovalRequests();
  requests.push(request);
  localStorage.setItem(STORAGE_KEYS.APPROVAL_REQUESTS, JSON.stringify(requests));
};

export const getApprovalRequests = (): ApprovalRequest[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPROVAL_REQUESTS);
  return data ? JSON.parse(data) : [];
};

export const getApprovalRequestsByApproverId = (approverId: string): ApprovalRequest[] => {
  const requests = getApprovalRequests();
  return requests.filter(r => r.approverId === approverId && r.status === 'pending');
};

export const getApprovalRequestsByRequesterId = (requesterId: string): ApprovalRequest[] => {
  const requests = getApprovalRequests();
  return requests.filter(r => r.requesterId === requesterId);
};

export const updateApprovalRequestStatus = (requestId: string, status: 'approved' | 'rejected'): void => {
  const requests = getApprovalRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index].status = status;
    requests[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.APPROVAL_REQUESTS, JSON.stringify(requests));
  }
};

export const getApprovalRequestById = (requestId: string): ApprovalRequest | undefined => {
  const requests = getApprovalRequests();
  return requests.find(r => r.id === requestId);
};
