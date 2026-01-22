import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, QrCode, AlertCircle, Sprout, Truck, Store, CheckCircle, ArrowRight } from 'lucide-react';
import { getProductByQRCode, getTransportLogByProductId, getRetailLogByProductId } from '../storage';
import { formatCurrency, formatDate } from '../utils';

export default function Consumer() {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [productJourney, setProductJourney] = useState<any>(null);

  const handleTrack = () => {
    setError('');
    setProductJourney(null);

    const product = getProductByQRCode(qrCode);

    if (!product) {
      setError('Product not found. Please check the QR code.');
      return;
    }

    const transportLog = getTransportLogByProductId(product.id);
    const retailLog = getRetailLogByProductId(product.id);

    setProductJourney({
      product,
      transportLog,
      retailLog,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Agrichain
              </span>
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Product</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter the product QR code to view its complete journey from farm to your hands
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-emerald-100">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Product QR Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="e.g., AGRI-ABC123"
              />
              <button
                onClick={handleTrack}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                Track
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {productJourney && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Product Name</p>
                  <p className="text-lg text-gray-900">{productJourney.product.productName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Quantity</p>
                  <p className="text-lg text-gray-900">{productJourney.product.quantity} kg</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium capitalize">
                    {productJourney.product.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">QR Code</p>
                  <p className="text-sm text-gray-900 font-mono">{productJourney.product.qrCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Journey Timeline</h2>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                      <Sprout className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                          Farmer
                        </h3>
                        <span className="text-xs text-gray-500">{formatDate(productJourney.product.createdAt)}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">Farmer:</span> {productJourney.product.farmerName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Initial Price:</span> {formatCurrency(productJourney.product.price)}/kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {productJourney.transportLog ? (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <CheckCircle className="w-5 h-5 text-teal-600 mr-2" />
                            Transportation
                          </h3>
                          <span className="text-xs text-gray-500">{formatDate(productJourney.transportLog.updatedAt)}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-semibold">Transporter:</span> {productJourney.transportLog.transporterName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Details:</span> {productJourney.transportLog.transportDetails}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Transport Cost:</span> {formatCurrency(productJourney.transportLog.transportCost)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Truck className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                        <h3 className="text-xl font-bold text-gray-400 mb-2">Transportation</h3>
                        <p className="text-sm text-gray-500">Awaiting transport...</p>
                      </div>
                    </div>
                  </div>
                )}

                {productJourney.retailLog ? (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Store className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <CheckCircle className="w-5 h-5 text-cyan-600 mr-2" />
                            Retail
                          </h3>
                          <span className="text-xs text-gray-500">{formatDate(productJourney.retailLog.updatedAt)}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-semibold">Retailer:</span> {productJourney.retailLog.retailerName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Location:</span> {productJourney.retailLog.location}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Retail Price:</span> {formatCurrency(productJourney.retailLog.retailPrice)}/kg
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                        <h3 className="text-xl font-bold text-gray-400 mb-2">Retail</h3>
                        <p className="text-sm text-gray-500">Not yet available at retail...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Verified Blockchain Record</h3>
                  <p className="text-emerald-100 leading-relaxed">
                    This product's journey has been recorded on the blockchain, ensuring complete transparency
                    and authenticity. Every step is verified and immutable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}