import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, Shield, Users, ArrowRight, Sprout, Truck, Store, ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Agrichain
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2.5 text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <Sprout className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="text-emerald-700 font-medium">Blockchain-Powered Transparency</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              From Farm to Fork,
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Every Step Matters
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform agricultural supply chains with blockchain technology.
              Empower farmers, ensure transparency, and build consumer trust through complete product traceability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/consumer"
                className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-emerald-200"
              >
                Track a Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Agrichain?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building trust through transparency, empowering every stakeholder in the agricultural supply chain
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-emerald-100">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Complete Transparency</h3>
            <p className="text-gray-600 leading-relaxed">
              Every transaction recorded on blockchain. Track products from origin to destination with immutable records and full visibility.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-teal-100">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Farmer Empowerment</h3>
            <p className="text-gray-600 leading-relaxed">
              Fair pricing and direct market access. Farmers receive proper recognition and compensation for their quality produce.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-cyan-100">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Consumer Trust</h3>
            <p className="text-gray-600 leading-relaxed">
              Know exactly what you're buying. Verify authenticity, quality, and origin of products with a simple QR code scan.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Product Journey</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Follow the complete lifecycle of agricultural products through our transparent supply chain
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <Sprout className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Farmer</h3>
              <p className="text-emerald-100">
                Creates product record with details, pricing, and blockchain wallet
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <Truck className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Transporter</h3>
              <p className="text-emerald-100">
                Updates with transport details, costs, and logistics information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <Store className="w-12 h-12 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Retailer</h3>
              <p className="text-emerald-100">
                Adds retail pricing, location, and product availability details
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform">
                <ShoppingBag className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4. Consumer</h3>
              <p className="text-emerald-100">
                Scans QR code to view complete product history and verify authenticity
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Agrichain</span>
            </div>
            <p className="text-gray-400">
              © 2025 Agrichain. Building transparent agricultural supply chains.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
