import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import UploadSchema from "./components/UploadSchema";
import AppList from "./pages/AppList";
import Profile from "./pages/Profile";
// import { APIDocsWrapper } from "./components/APIDocs";
import ApiTesterTabs from "./pages/ApiTesterTabs";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Footer from "./components/Footer";

import ApiDetails from "./pages/ApiDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
      
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />

          <Route path="/upload" element={<PrivateRoute><UploadSchema /></PrivateRoute>} />
          <Route path="/apis" element={<PrivateRoute><AppList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          {/* <Route path="/docs/:apiName" element={<APIDocsWrapper />} /> */}

        
          <Route path="/test/:apiName" element={<PrivateRoute><ApiTesterTabs /></PrivateRoute>} />
            <Route path="/details/:apiName" element={<PrivateRoute><ApiDetails /></PrivateRoute>} />
       
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
