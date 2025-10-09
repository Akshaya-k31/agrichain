import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, UserPlus, Wallet } from 'lucide-react';
import { saveUser, setCurrentUser } from '../storage';
import { generateWalletId } from '../utils';
import { UserRole } from '../types';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'farmer' as UserRole,
  });
  const [walletId] = useState(generateWalletId());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      id: crypto.randomUUID(),
      ...formData,
      walletId,
    };

    saveUser(newUser);
    setCurrentUser(newUser);

    switch (formData.role) {
      case 'farmer':
        navigate('/farmer-dashboard');
        break;
      case 'transporter':
        navigate('/transporter-dashboard');
        break;
      case 'retailer':
        navigate('/retailer-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Agrichain
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join the transparent supply chain revolution</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white"
              >
                <option value="farmer">Farmer</option>
                <option value="transporter">Transporter</option>
                <option value="retailer">Retailer</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
              <div className="flex items-start space-x-3">
                <Wallet className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Your Blockchain Wallet ID
                  </p>
                  <p className="text-xs text-gray-600 break-all font-mono bg-white px-3 py-2 rounded-lg">
                    {walletId}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
