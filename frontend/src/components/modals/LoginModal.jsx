import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import useAuthStore from "@/store/useAuthStore";
import { Loader2, Eye, EyeOff, LogIn } from "lucide-react";

function LoginModal({ loginModal, setLoginModal, setSignupModal }) {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await login(loginData);
    if (isSuccess) {
      setLoginModal(false);
    }
  };

  const onShowPasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={loginModal} onOpenChange={setLoginModal}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-950 bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent text-3xl font-semibold mb-1">
            Welcome Back{" "}
            <LogIn className="w-6 h-6 inline-block text-blue-950" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-600 mb-1">
            Sign in to your account
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative-group">
              <label htmlFor="email" className="block text-sm font-semibold ml-1 mb-3 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="border border-gray-700 py-2 px-2 rounded-lg text-lg focus:outline-blue-800 focus:border-blue-900 w-full"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="block text-sm font-semibold mb-3 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className="border border-gray-700 py-2 px-2 pr-12 rounded-lg text-lg focus:outline-blue-800 focus:border-blue-900 w-full"
                  required
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-800 transition-colors"
                  onClick={onShowPasswordToggle}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button"
                className="text-blue-800 cursor-pointer font-semibold hover:text-blue-900 underline decoration-2 underline-offset-2 hover:decoration-blue-900 transition-all duration-300 text-sm"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-8 text-xl font-semibold rounded-2xl transition-all duration-300 ease-in-out flex items-center justify-center gap-3 shadow-xl ${
                isLoggingIn
                  ? 'bg-gray-400 cursor-not-allowed shadow-gray-400/25'
                  : 'bg-gradient-to-r from-blue-800 to-indigo-950 hover:from-blue-800 hover:to-indigo-950 hover:shadow-2xl hover:shadow-blue-900/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              } text-white transform`}
              disabled={isLoggingIn}
            >
              <Loader2
                className={`h-6 w-6 ${
                  isLoggingIn ? "animate-spin" : "hidden"
                }`}
              />
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <DialogFooter>
          <div className="w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm mb-4">Or continue with</p>
              <div className="flex items-center justify-center gap-4">
                <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200">
                  <FcGoogle className="w-6 h-6" />
                </button>

                <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200">
                  <FaGithub className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                onClick={() => {
                  setLoginModal(false);
                  setSignupModal(true);
                }}
                className="text-blue-800 cursor-pointer font-semibold hover:text-blue-900 underline decoration-2 underline-offset-2 hover:decoration-blue-900 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
