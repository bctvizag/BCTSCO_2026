import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Search, Users, ShoppingBag, ExternalLink } from 'lucide-react';
import ProductsPage from './pages/ProductsPage';
import MembersPage from './pages/MembersPage';
import ApiCheckerPage from './pages/ApiCheckerPage';

// Navigation component with active route highlighting
const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Search className="w-8 h-8 mr-2 text-blue-500" />
            Search System
          </h1>
          <nav className="flex space-x-4">
            <Link
              to="/products"
              className={`px-4 py-2 rounded-md flex items-center ${
                isActive('/products') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Products
            </Link>
            <Link
              to="/members"
              className={`px-4 py-2 rounded-md flex items-center ${
                isActive('/members') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Members
            </Link>
            <Link
              to="/api-checker"
              className={`px-4 py-2 rounded-md flex items-center ${
                isActive('/api-checker') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              API Checker
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Main layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route 
          path="/products" 
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          } 
        />
        <Route 
          path="/members" 
          element={
            <Layout>
              <MembersPage />
            </Layout>
          } 
        />
        <Route 
          path="/api-checker" 
          element={
            <Layout>
              <ApiCheckerPage />
            </Layout>
          } 
        />
        <Route 
          path="*" 
          element={
            <Layout>
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Go Home
                </Link>
              </div>
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;