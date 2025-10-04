import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useAuthStore from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

function VerifyOtpModal({ isOpen, onClose, email }) {
  const { verifyOtp, isVerifyingOtp, error } = useAuthStore();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await verifyOtp({ email, otp });
    if (isSuccess) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Verify Your Account</DialogTitle>
          <DialogDescription className="text-center">
            An OTP has been sent to {email}. Please enter it below to verify your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative-group">
            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter the 6-digit OTP"
              className="border border-gray-300 py-2 px-4 rounded-lg w-full"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className={`w-full py-3 cursor-pointer px-6 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3 ${
              isVerifyingOtp
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={isVerifyingOtp}
          >
            <Loader2
              className={`h-6 w-6 ${
                isVerifyingOtp ? "animate-spin" : "hidden"
              }`}
            />
            {isVerifyingOtp ? "Verifying..." : "Verify"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyOtpModal;
