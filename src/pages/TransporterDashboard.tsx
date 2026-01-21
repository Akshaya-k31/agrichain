import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Truck, LogOut, CheckCircle, AlertCircle, Package, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import {
  getCurrentUser,
  clearCurrentUser,
  getProductByQRCode,
  saveTransportLog,
  updateProductStatus,
  getTransportLogs,
  saveApprovalRequest,
  getApprovalRequestsByRequesterId,
  getApprovalRequestsByApproverId,
  updateApprovalRequestStatus,
  getApprovalRequestById,
  saveRetailLog
} from '../storage';
import { formatCurrency, formatDate } from '../utils';
import { TransportLog, ApprovalRequest, RetailLog } from '../types';

export default function TransporterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [qrCode, setQrCode] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myTransports, setMyTransports] = useState<TransportLog[]>([]);
  const [myRequests, setMyRequests] = useState<ApprovalRequest[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [formData, setFormData] = useState({
    transportDetails: '',
    transportCost: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'transporter') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    const allTransports = getTransportLogs();
    const filtered = allTransports.filter(t => t.transporterId === user?.id);
    setMyTransports(filtered);

    const requests = getApprovalRequestsByRequesterId(user!.id);
    setMyRequests(requests);

    const approvals = getApprovalRequestsByApproverId(user!.id);
    setPendingApprovals(approvals);
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

    const approvalRequest: ApprovalRequest = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.productName,
      requesterId: user!.id,
      requesterName: user!.name,
      requesterRole: 'transporter',
      approverId: product.farmerId,
      approverRole: 'farmer',
      status: 'pending',
      requestData: transportLog,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveApprovalRequest(approvalRequest);

    setSuccess('Approval request sent to farmer successfully!');
    setFormData({ transportDetails: '', transportCost: '' });
    setQrCode('');
    setProduct(null);
    loadData();

    setTimeout(() => setSuccess(''), 5000);
  };

  const handleApproveRetail = (requestId: string) => {
    const request = getApprovalRequestById(requestId);
    if (!request) return;

    const retailLog = request.requestData as RetailLog;
    saveRetailLog(retailLog);
    updateProductStatus(request.productId, 'at_retail');
    updateApprovalRequestStatus(requestId, 'approved');

    setSuccess('Retail request approved successfully!');
    loadData();
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleRejectRetail = (requestId: string) => {
    updateApprovalRequestStatus(requestId, 'rejected');
    setSuccess('Retail request rejected.');
    loadData();
    setTimeout(() => setSuccess(''), 3000);
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
        {pendingApprovals.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-8 border border-orange-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pending Retail Approvals</h2>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {pendingApprovals.map((approval) => {
                const retailData = approval.requestData as RetailLog;
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
                        <span className="font-semibold">Retail Price:</span> {formatCurrency(retailData.retailPrice)}/kg
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Location:</span> {retailData.location}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveRetail(approval.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectRetail(approval.id)}
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
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Request Transport Approval</h2>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && !pendingApprovals.length && (
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
                  <Clock className="w-5 h-5" />
                  <span>Request Approval</span>
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
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
                    <div key={request.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-colors">
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

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Approved Transports</h2>
              </div>

              {myTransports.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No approved transports yet.</p>
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
    </div>
  );
}
