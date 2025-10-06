import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import useElectionStore from '../../store/useElectionStore';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

const RequestPincodeModal = ({ electionId, children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPincode, error, message } = useElectionStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await requestPincode(electionId);
    setIsSubmitting(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white border-0 shadow-xl sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            Request Pincode
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            A pincode will be sent to your registered email address to access this election.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {message && (
            <div className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 p-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Pincode</span>
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPincodeModal;
