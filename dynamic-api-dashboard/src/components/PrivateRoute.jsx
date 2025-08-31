// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Show nothing (or a loader) until auth is resolved
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg">
      Checking authentication...
    </div>;
  }

  if (!user) {
    // Not logged in → redirect to login ("/")
    return <Navigate to="/" replace />;
  }

  // Logged in → allow access
  return children;
}

export default PrivateRoute;
