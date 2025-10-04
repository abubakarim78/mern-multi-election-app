import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggingIn: false,
      isSigningUp: false,
      isVerifyingOtp: false,
      error: null,

      signup: async (formData) => {
        set({ isSigningUp: true, error: null });
        try {
          const response = await axios.post("/auth/signup", formData);
          toast.success(response.data.message);
          set({ isSigningUp: false });
          return response.data.user; // Return user object with email
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Signup failed";
          set({
            error: errorMessage,
            isSigningUp: false,
          });
          toast.error(errorMessage);
          return null;
        }
      },

      verifyOtp: async (data) => {
        set({ isVerifyingOtp: true, error: null });
        try {
          const response = await axios.post("/auth/verify-otp", data);
          const { user, token } = response.data;
          set({ user, token, isVerifyingOtp: false });
          toast.success("Account verified successfully!");
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "OTP verification failed";
          set({
            error: errorMessage,
            isVerifyingOtp: false,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      login: async (formData) => {
        set({ isLoggingIn: true, error: null });
        try {
          const response = await axios.post("/auth/login", formData);
          const { token, ...user } = response.data;
          set({ user, token, isLoggingIn: false });
          toast.success("Login successful!");
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({
            error: errorMessage,
            isLoggingIn: false,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        toast.success("Logout successful!");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
