import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Store, LogOut, CheckCircle, AlertCircle, Package, Clock } from 'lucide-react';
import {
  getCurrentUser,
  clearCurrentUser,
  getProductByQRCode,
  getRetailLogs,
  getTransportLogByProductId,
  saveApprovalRequest,
  getApprovalRequestsByRequesterId
} from '../storage';
import { formatCurrency, formatDate } from '../utils';
import { RetailLog, ApprovalRequest } from '../types';

export default function RetailerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [qrCode, setQrCode] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myRetails, setMyRetails] = useState<RetailLog[]>([]);
  const [myRequests, setMyRequests] = useState<ApprovalRequest[]>([]);
  const [formData, setFormData] = useState({
    retailPrice: '',
    location: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'retailer') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    const allRetails = getRetailLogs();
    const filtered = allRetails.filter(r => r.retailerId === user?.id);
    setMyRetails(filtered);

    const requests = getApprovalRequestsByRequesterId(user!.id);
    setMyRequests(requests);
  };

  const handleScanQR = () => {
    setError('');
    setSuccess('');
    setProduct(null);

    const foundProduct = getProductByQRCode(qrCode);

    if (!foundProduct) {
      setError('Product not found. Please check the QR code.');
      return;
    }

    if (foundProduct.status === 'created') {
      setError('This product has not been transported yet.');
      return;
    }

    if (foundProduct.status === 'at_retail' || foundProduct.status === 'sold') {
      setError('This product has already been received by a retailer.');
      return;
    }

    const transportLog = getTransportLogByProductId(foundProduct.id);
    if (!transportLog) {
      setError('Transport information not found for this product.');
      return;
    }

    setProduct({ ...foundProduct, transportLog });
  };

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!product) {
      setError('Please scan a QR code first.');
      return;
    }

    const retailLog: RetailLog = {
      id: crypto.randomUUID(),
      productId: product.id,
      retailerId: user!.id,
      retailPrice: parseFloat(formData.retailPrice),
      location: formData.location,
      updatedAt: new Date().toISOString(),
      retailerName: user!.name,
    };

    const approvalRequest: ApprovalRequest = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.productName,
      requesterId: user!.id,
      requesterName: user!.name,
      requesterRole: 'retailer',
      approverId: product.transportLog.transporterId,
      approverRole: 'transporter',
      status: 'pending',
      requestData: retailLog,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveApprovalRequest(approvalRequest);

    setSuccess('Approval request sent to transporter successfully!');
    setFormData({ retailPrice: '', location: '' });
    setQrCode('');
    setProduct(null);
    loadData();

    setTimeout(() => setSuccess(''), 5000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Retailer Dashboard</h1>
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
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-cyan-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Request Retail Approval</h2>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scan QR Code or Enter Product ID
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all"
                    placeholder="e.g., AGRI-ABC123"
                  />
                  <button
                    onClick={handleScanQR}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg"
                  >
                    Scan
                  </button>
                </div>
              </div>

              {product && (
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border-2 border-cyan-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Product Found</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-800">
                      <span className="font-semibold">Product:</span> {product.productName}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Quantity:</span> {product.quantity} kg
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Farmer:</span> {product.farmerName}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Original Price:</span> {formatCurrency(product.price)}/kg
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Retail Price per kg (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all"
                    placeholder="e.g., 80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all"
                    placeholder="e.g., Delhi Central Market, Shop 45"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!product}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Clock className="w-5 h-5" />
                  <span>Request Approval</span>
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-cyan-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
              </div>

              {myRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No requests yet. Submit your first request above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div key={request.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                      <h3 className="font-bold text-gray-900 mb-2">{request.productName}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Status:</span>{' '}
                          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium capitalize ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {request.status}
                          </span>
                        </p>
                        <p className="text-gray-500 text-xs">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-cyan-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Approved Products</h2>
              </div>

              {myRetails.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No approved products yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRetails.map((retail) => (
                    <div key={retail.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Location:</span> {retail.location}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Retail Price:</span> {formatCurrency(retail.retailPrice)}/kg
                        </p>
                        <p className="text-gray-500 text-xs">{formatDate(retail.updatedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
