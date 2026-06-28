import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

import {
  ShieldCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

const Login = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { login, handleToken } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    const completeLogin = async () => {
      if (!token) {
        return;
      }

      await handleToken(token);
      navigate("/apis", { replace: true });
    };

    completeLogin();
  }, [location.search, handleToken, navigate]);

  const handleLogin = async (provider) => {
    setIsLoading(true);

    try {
      await login(provider);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

      {/* Background Glow */}

      <div className="absolute left-20 top-20 w-72 h-72 rounded-full bg-green-500/10 blur-[120px] animate-pulse"></div>

      <div className="absolute right-20 bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-[160px] animate-pulse"></div>

      {/* Card */}

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-green-500/20 bg-gray-900/95 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

        {/* Top Gradient */}

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>

        {/* Close */}

        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-10 w-10 rounded-full border border-gray-700 bg-gray-800 text-gray-400 transition-all duration-300 hover:border-green-400 hover:text-green-400"
        >
          ✕
        </button>

        {/* Header */}

        <div className="relative overflow-hidden px-8 pt-12 pb-8">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#22c55e25,transparent_70%)]"></div>

          <div className="relative text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-2xl shadow-green-500/30">

              <SparklesIcon className="h-10 w-10 text-white"/>

            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="mt-3 text-gray-400 leading-relaxed">
              Sign in to continue building production-ready APIs
              with <span className="text-green-400 font-semibold">ReqNest.</span>
            </p>

        </div>

        </div>

        {/* Body */}

        <div className="px-8 pb-8">

          <div className="space-y-4">
            {/* Google Login */}

<button
  onClick={() => handleLogin("google")}
  disabled={isLoading}
  className="group relative w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/70 px-6 py-4 transition-all duration-300 hover:border-green-400/40 hover:bg-gray-800 hover:shadow-xl hover:shadow-green-500/20 disabled:opacity-60"
>
  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

  <div className="relative flex items-center justify-center gap-4">

    <svg className="h-6 w-6" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.25 1.36-1.03 2.52-2.2 3.29v2.74h3.56c2.08-1.92 3.28-4.73 3.28-8.04z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.74c-.99.66-2.25 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.52H2.18v2.84A10.99 10.99 0 0012 23z"/>
      <path fill="#FBBC05" d="M5.84 14.14A6.65 6.65 0 015.5 12c0-.74.13-1.45.34-2.14V7.02H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.98l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.34c1.62 0 3.07.56 4.22 1.65l3.15-3.15C17.46 2.1 14.98 1 12 1A11 11 0 002.18 7.02l3.66 2.84C6.71 7.27 9.14 5.34 12 5.34z"/>
    </svg>

    <span className="font-semibold text-white">

      {isLoading ? (

        <span className="flex items-center gap-3">

          <svg
            className="h-5 w-5 animate-spin text-green-400"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
            />
          </svg>

          Redirecting...

        </span>

      ) : (
        "Continue with Google"
      )}

    </span>

    <ArrowRightIcon className="h-5 w-5 text-green-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"/>
  </div>
</button>

{/* GitHub Login */}

<button
  onClick={() => handleLogin("github")}
  disabled={isLoading}
  className="group relative w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/70 px-6 py-4 transition-all duration-300 hover:border-green-400/40 hover:bg-gray-800 hover:shadow-xl hover:shadow-green-500/20 disabled:opacity-60"
>

  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

  <div className="relative flex items-center justify-center gap-4">

    <svg
      className="h-6 w-6 text-white"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .5A11.5 11.5 0 00.5 12.08c0 5.11 3.29 9.44 7.86 10.97.58.1.79-.25.79-.56v-2.01c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.74.4-1.25.73-1.53-2.55-.29-5.24-1.29-5.24-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.05 0 0 .98-.32 3.2 1.18A10.8 10.8 0 0112 6.2a10.8 10.8 0 012.91.39c2.22-1.5 3.2-1.18 3.2-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.42-5.26 5.7.42.37.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12.08 11.5 11.5 0 0012 .5z"/>
    </svg>

    <span className="font-semibold text-white">
      Continue with GitHub
    </span>

    <ArrowRightIcon className="h-5 w-5 text-green-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"/>

  </div>

</button>



          {/* Divider */}

          <div className="my-8 flex items-center">

            <div className="h-px flex-1 bg-gray-800"></div>

            <span className="px-4 text-xs uppercase tracking-widest text-gray-500">
              Secure Access
            </span>

            <div className="h-px flex-1 bg-gray-800"></div>

          </div>

  



        </div>

      </div>
  </div>
    </div>

  );
  };

export default Login;