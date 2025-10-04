import React, { useState, useEffect } from "react";
import useElectionStore from "@/store/useElectionStore";
import ElectionCard from "@/components/ElectionCard";
import UpdateElectionModal from "@/components/modals/UpdateElectionModal";
import PincodeModal from "@/components/modals/PincodeModal";
import { Link } from "react-router-dom";
import { Vote, Shield, Users, TrendingUp } from "lucide-react";

function HomePage() {
  const { elections, fetchElections, loading } = useElectionStore();
  const [updateElectionModalOpen, setUpdateElectionModalOpen] = useState(false);
  const [electionToUpdate, setElectionToUpdate] = useState(null);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [electionIdForPincode, setElectionIdForPincode] = useState(null);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleEditElection = (election) => {
    setElectionToUpdate(election);
    setUpdateElectionModalOpen(true);
  };

  const handleViewDetailsClick = (electionId) => {
    setElectionIdForPincode(electionId);
    setPincodeModalOpen(true);
  };

  const features = [
    { icon: Shield,
      title: "Secure Voting",
      description: "End-to-end encryption ensures your vote remains private and secure"
    },
    {
      icon: Users,
      title: "Transparent Process",
      description: "Real-time updates and verifiable results you can trust"
    },
    {
      icon: TrendingUp,
      title: "Live Results",
      description: "Watch election results unfold in real-time with detailed analytics"
    },
    {
      icon: Vote,
      title: "Easy Participation",
      description: "Simple, intuitive interface makes voting accessible to everyone"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Democracy Made Simple
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100">
              Secure, transparent, and accessible voting for everyone. Join thousands making their voices heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/elections"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Browse Elections
              </Link>
              <button
                className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-all border-2 border-blue-500"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Elections Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Active Elections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Participate in ongoing elections or explore upcoming opportunities to make your voice heard
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading elections...</p>
            </div>
          </div>
        ) : elections.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {elections.slice(0, 6).map((election) => (
                <ElectionCard
                  key={election._id}
                  election={election}
                  onEdit={handleEditElection}
                  onViewDetailsClick={handleViewDetailsClick}
                  bannerUrl={useElectionStore.getState().getElectionImageUrl(election._id)}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/elections"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                View All Elections
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Active Elections
            </h3>
            <p className="text-gray-600">
              Check back soon for upcoming elections
            </p>
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Join Multi-Elect today and participate in secure, transparent elections
            </p>
            <Link
              to="/elections"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
      {electionToUpdate && (
        <UpdateElectionModal
          updateElectionModalOpen={updateElectionModalOpen}
          setUpdateElectionModalOpen={setUpdateElectionModalOpen}
          electionToUpdate={electionToUpdate}
        />
      )}
      <PincodeModal
        isOpen={pincodeModalOpen}
        onClose={() => setPincodeModalOpen(false)}
        electionId={electionIdForPincode}
      />
    </div>
  );
}

export default HomePage;