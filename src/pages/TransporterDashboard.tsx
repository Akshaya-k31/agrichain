import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Truck, LogOut, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { getCurrentUser, clearCurrentUser, getProductByQRCode, saveTransportLog, updateProductStatus, getTransportLogs } from '../storage';
import { formatCurrency, formatDate } from '../utils';
import { TransportLog } from '../types';

export default function TransporterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [qrCode, setQrCode] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myTransports, setMyTransports] = useState<TransportLog[]>([]);
  const [formData, setFormData] = useState({
    transportDetails: '',
    transportCost: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'transporter') {
      navigate('/login');
      return;
    }
    loadMyTransports();
  }, [user, navigate]);

  const loadMyTransports = () => {
    const allTransports = getTransportLogs();
    const filtered = allTransports.filter(t => t.transporterId === user?.id);
    setMyTransports(filtered);
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

    if (foundProduct.status === 'in_transport' || foundProduct.status === 'at_retail' || foundProduct.status === 'sold') {
      setError('This product has already been transported.');
      return;
    }

    setProduct(foundProduct);
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

    const transportLog: TransportLog = {
      id: crypto.randomUUID(),
      productId: product.id,
      transporterId: user!.id,
      transportDetails: formData.transportDetails,
      transportCost: parseFloat(formData.transportCost),
      updatedAt: new Date().toISOString(),
      transporterName: user!.name,
    };

    saveTransportLog(transportLog);
    updateProductStatus(product.id, 'in_transport');

    setSuccess('Transport details updated successfully!');
    setFormData({ transportDetails: '', transportCost: '' });
    setQrCode('');
    setProduct(null);
    loadMyTransports();

    setTimeout(() => setSuccess(''), 5000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-xl">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Transporter Dashboard</h1>
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
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Update Transport Details</h2>
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
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
                    placeholder="e.g., AGRI-ABC123"
                  />
                  <button
                    onClick={handleScanQR}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg"
                  >
                    Scan
                  </button>
                </div>
              </div>

              {product && (
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border-2 border-teal-200">
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
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transport Details
                  </label>
                  <textarea
                    required
                    value={formData.transportDetails}
                    onChange={(e) => setFormData({ ...formData, transportDetails: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
                    placeholder="e.g., Refrigerated truck, Route: Mumbai to Delhi"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transport Cost (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.transportCost}
                    onChange={(e) => setFormData({ ...formData, transportCost: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
                    placeholder="e.g., 5000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!product}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Update Transport</span>
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">My Transports</h2>
            </div>

            {myTransports.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transports logged yet. Scan a QR code to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTransports.map((transport) => (
                  <div key={transport.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors">
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold">Details:</span> {transport.transportDetails}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Cost:</span> {formatCurrency(transport.transportCost)}
                      </p>
                      <p className="text-gray-500 text-xs">{formatDate(transport.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
