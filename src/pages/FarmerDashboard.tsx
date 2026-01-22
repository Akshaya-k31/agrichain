import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Plus, Package, LogOut, QrCode, CheckCircle, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getCurrentUser, clearCurrentUser, saveProduct, getProducts } from '../storage';
import { generateProductId, formatCurrency, formatDate } from '../utils';
import { Product } from '../types';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [showQR, setShowQR] = useState(false);
  const [generatedQR, setGeneratedQR] = useState('');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    price: '',
  });

  // Security Check: Redirect if not logged in as a farmer
  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/login');
      return;
    }
    loadMyProducts();
  }, [user, navigate]);

  const loadMyProducts = () => {
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => p.farmerId === user?.id);
    // Sort by newest first
    setMyProducts(filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productId = generateProductId();
    
    // Updated Logic: QR code now points to the live deployment URL
    const baseUrl = 'https://agrichaindemo.netlify.app';
    const qrCodeUrl = `${baseUrl}/?productId=${productId}`;

    const newProduct: Product = {
      id: productId,
      farmerId: user!.id,
      productName: formData.productName,
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      qrCode: qrCodeUrl,
      status: 'created',
      createdAt: new Date().toISOString(),
      farmerName: user!.name,
    };

    saveProduct(newProduct);
    setGeneratedQR(qrCodeUrl);
    setShowQR(true);
    setFormData({ productName: '', quantity: '', price: '' });
    loadMyProducts();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-emerald-100">
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
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Create Product Form */}
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 h-fit">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Batch</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="e.g., Organic Basmati Rice"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price per kg (₹)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Generate Product & QR</span>
              </button>
            </form>
          </section>

          {/* QR Code Success Display */}
          <div className="relative">
            {showQR ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-emerald-500 animate-in fade-in zoom-in duration-300">
                <button 
                  onClick={() => setShowQR(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">QR Code Ready</h2>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Scan this code to track the supply chain journey of this product.
                  </p>
                  <div className="bg-white p-6 rounded-2xl inline-block shadow-inner border border-emerald-100">
                    <QRCodeSVG 
                      value={generatedQR} 
                      size={220} 
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Direct Link</p>
                    <p className="text-sm font-mono text-emerald-700 break-all select-all">{generatedQR}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-800/5 rounded-2xl border-2 border-dashed border-emerald-200 h-full flex flex-col items-center justify-center p-8 text-center">
                <QrCode className="w-16 h-16 text-emerald-200 mb-4" />
                <p className="text-emerald-800 font-medium">Create a product to generate a trackable QR code</p>
              </div>
            )}
          </div>
        </div>

        {/* Product List */}
        <section className="mt-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          </div>

          {myProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md py-20 text-center border border-gray-100">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your inventory is currently empty.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {product.productName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      product.status === 'created' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Quantity</span>
                      <span className="text-gray-900 font-bold">{product.quantity} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Price</span>
                      <span className="text-gray-900 font-bold">{formatCurrency(product.price)} / kg</span>
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <p className="text-gray-400 text-xs">{formatDate(product.createdAt)}</p>
                      <button 
                        onClick={() => {
                          setGeneratedQR(product.qrCode);
                          setShowQR(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wider"
                      >
                        View QR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}