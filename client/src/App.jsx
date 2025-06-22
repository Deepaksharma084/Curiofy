import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterOwner from "./components/RegisterOwnerForm";
import LoginOwner from "./components/LoginOwnerForm";
import CreateBlogForm from "./components/CreateBlogPosts";
import UpdateOwnerForm from "./components/UpdateOwnerForm";
import Navbar from './components/Navbar';
import BlogListing from './components/BlogListing';
import Home from './components/Home';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import BlogUpdate from './components/BlogUpdate';
import NotFound from './components/NotFound';
import './App.css'

//ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { owner } = useAuth();
  if (!owner) {
    return <Navigate to="/owner/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/owner/register" element={<RegisterOwner />} />
            <Route path="/owner/login" element={<LoginOwner />} />
            <Route
              path="/blogs/create"
              element={
                <ProtectedRoute>
                  <CreateBlogForm />
                </ProtectedRoute>
              }
            />
            <Route path="/owner/updateOwner" element={<UpdateOwnerForm />} />
            <Route path="/blogs/:category" element={<BlogListing />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog/edit/:id" element={<BlogUpdate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App