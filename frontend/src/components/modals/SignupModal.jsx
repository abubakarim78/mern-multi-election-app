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
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";

function SignupModal({ signupModal, setSignupModal, setLoginModal }) {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSuccess = await signup(newUserData);
    if (isSuccess) {
      setNewUserData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
      setSignupModal(false);
      setLoginModal(true);
    }
  };

  const onShowPasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={signupModal} onOpenChange={setSignupModal}>
      <DialogContent className="max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-950 bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent text-3xl font-semibold mb-1">
            Create Account{" "}
            <UserPlus className="w-6 h-6 inline-block text-blue-950" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-600 mb-1">
            Join us today and get started
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative-group">
              <label htmlFor="name" className="block text-sm font-semibold ml-1 mb-3 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="border border-gray-700 py-2 px-2 rounded-lg text-lg focus:outline-blue-800 focus:border-blue-900 w-full"
                required
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative-group">
                <label htmlFor="email" className="block text-sm font-semibold mb-3 text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-700 py-2 px-4 rounded-lg text-lg focus:outline-blue-800 focus:border-blue-900"
                  required
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                />
              </div>

              <div className="relative-group">
                <label htmlFor="phone" className="block text-sm font-semibold mb-3 text-gray-700">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-700 py-2 px-4 rounded-lg text-lg focus:outline-blue-800 focus:border-blue-900"
                  value={newUserData.phone}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="block text-sm font-semibold mb-3 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Create a secure password"
                  className="border border-gray-700 py-2 px-2 pr-12 rounded-lg text-lg focus:outline-blue-800 focus:border-blue-900 w-full"
                  required
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
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

            <button
              type="submit"
              className={`w-full py-3 px-8 text-xl font-semibold rounded-2xl transition-all duration-300 ease-in-out flex items-center justify-center gap-3 shadow-xl ${
                isSigningUp
                  ? 'bg-gray-400 cursor-not-allowed shadow-gray-400/25'
                  : 'bg-gradient-to-r from-blue-800 to-indigo-950 hover:from-blue-800 hover:to-indigo-950 hover:shadow-2xl hover:shadow-blue-900/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              } text-white transform`}
              disabled={isSigningUp}
            >
              <Loader2
                className={`h-6 w-6 ${
                  isSigningUp ? "animate-spin" : "hidden"
                }`}
              />
              {isSigningUp ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>

        <DialogFooter>
          <div className="w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4">
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
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={() => {
                  setSignupModal(false);
                  setLoginModal(true);
                }}
                className="text-blue-800 cursor-pointer font-semibold hover:text-blue-900 underline decoration-2 underline-offset-2 hover:decoration-blue-900 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SignupModal;