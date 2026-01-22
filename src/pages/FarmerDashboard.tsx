import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Plus, Package, LogOut, QrCode, CheckCircle, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  getCurrentUser,
  clearCurrentUser,
  saveProduct,
  getProducts,
  getApprovalRequestsByApproverId,
  updateApprovalRequestStatus,
  getApprovalRequestById,
  saveTransportLog,
  updateProductStatus
} from '../storage';
import { generateProductId, generateQRCode, formatCurrency, formatDate } from '../utils';
import { Product, ApprovalRequest, TransportLog } from '../types';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [showQR, setShowQR] = useState(false);
  const [generatedQR, setGeneratedQR] = useState('');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    price: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => p.farmerId === user?.id);
    setMyProducts(filtered);

    const approvals = getApprovalRequestsByApproverId(user!.id);
    setPendingApprovals(approvals);
  };

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productId = generateProductId();
    const qrCode = generateQRCode(productId);

    const newProduct: Product = {
      id: productId,
      farmerId: user!.id,
      productName: formData.productName,
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      qrCode,
      status: 'created',
      createdAt: new Date().toISOString(),
      farmerName: user!.name,
    };

    saveProduct(newProduct);
    setGeneratedQR(qrCode);
    setShowQR(true);
    setFormData({ productName: '', quantity: '', price: '' });
    loadData();
  };

  const handleApproveTransport = (requestId: string) => {
    const request = getApprovalRequestById(requestId);
    if (!request) return;

    const transportLog = request.requestData as TransportLog;
    saveTransportLog(transportLog);
    updateProductStatus(request.productId, 'in_transport');
    updateApprovalRequestStatus(requestId, 'approved');

    setSuccess('Transport request approved successfully!');
    loadData();
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleRejectTransport = (requestId: string) => {
    updateApprovalRequestStatus(requestId, 'rejected');
    setSuccess('Transport request rejected.');
    loadData();
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) return null;

  // Generate scannable QR URL with product ID
  const scannableQRUrl = `https://agrichaindemo.netlify.app/?product=${generatedQR}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingApprovals.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-8 border border-orange-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pending Transport Approvals</h2>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {pendingApprovals.map((approval) => {
                const transportData = approval.requestData as TransportLog;
                return (
                  <div key={approval.id} className="border-2 border-orange-200 rounded-xl p-6 bg-gradient-to-br from-orange-50 to-red-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{approval.productName}</h3>
                        <p className="text-sm text-gray-600">Requested by: {approval.requesterName}</p>
                        <p className="text-xs text-gray-500">{formatDate(approval.createdAt)}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 mb-4 space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Transport Details:</span> {transportData.transportDetails}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Transport Cost:</span> {formatCurrency(transportData.transportCost)}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveTransport(approval.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectTransport(approval.id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all flex items-center justify-center space-x-2"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price per kg (₹)
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="e.g., 50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Product</span>
              </button>
            </form>
          </div>

          {showQR && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Product Created!</h2>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Share this QR code with transporters and retailers. Scanning redirects to product page.
                </p>
                <div className="bg-white p-8 rounded-xl inline-block shadow-lg border-2 border-emerald-200 mx-auto mb-6">
                  <QRCodeSVG 
                    value={scannableQRUrl} 
                    size={256} 
                    level="H" 
                    includeMargin={true}
                  />
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Product ID</p>
                  <p className="text-lg font-mono text-emerald-700 break-all">{generatedQR}</p>
                </div>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          </div>

          {myProducts.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products created yet. Create your first product above!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProducts.map((product) => (
                <div key={product.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                  <h3 className="font-bold text-gray-900 mb-2">{product.productName}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Quantity:</span> {product.quantity} kg
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Price:</span> {formatCurrency(product.price)}/kg
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Status:</span>{' '}
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium capitalize">
                        {product.status.replace('_', ' ')}
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
