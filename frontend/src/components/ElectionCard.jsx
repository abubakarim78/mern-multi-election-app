import React from "react";
import useAuthStore from "@/store/useAuthStore";
import useElectionStore from "@/store/useElectionStore";
import { Calendar, Edit, Trash2, Eye } from "lucide-react";
import RequestPincodeModal from "./modals/RequestPincodeModal";

function ElectionCard({ election, onEdit, bannerUrl, onViewDetailsClick }) {
  const { user } = useAuthStore();
  const { deleteElection } = useElectionStore();

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isElectionActive = () => {
    const now = new Date();
    const startDate = new Date(election?.startDate);
    const endDate = new Date(election?.endDate);
    
    if (now < startDate) return "upcoming";
    if (now > endDate) return "ended";
    return "active";
  };

  const getStatusBadge = () => {
    const status = isElectionActive();
    const statusConfig = {
      upcoming: { text: "Upcoming", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      active: { text: "Active", class: "bg-green-100 text-green-800 border-green-200" },
      ended: { text: "Ended", class: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    return statusConfig[status];
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt={election.title || "Election banner"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <p className="text-blue-600 font-medium text-sm">No banner image</p>
            </div>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusBadge.class} backdrop-blur-sm`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex-grow mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {election?.title || "Untitled Election"}
          </h2>
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {election?.description || "No description available for this election."}
          </p>
        </div>

        {/* Date Information */}
        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>
              <span className="font-semibold text-gray-800">Starts:</span> {formatDate(election?.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-600" />
            <span>
              <span className="font-semibold text-gray-800">Ends:</span> {formatDate(election?.endDate)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
          <button 
            onClick={() => onViewDetailsClick(election._id)}
            className="px-5 py-2.5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-md active:scale-95 flex items-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {user && user.role !== "Election Official" && (
            <RequestPincodeModal electionId={election._id} electionStatus={isElectionActive()}>
              <button
                disabled={isElectionActive() !== 'active'}
                className="px-5 py-2.5 bg-gray-600 cursor-pointer hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-md active:scale-95 flex items-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Request Pincode
              </button>
            </RequestPincodeModal>
          )}
          
          {user && user.role === "Election Official" && (
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit?.(election)}
                className="p-2.5 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => deleteElection(election._id)}
                className="p-2.5 cursor-pointer bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ElectionCard;