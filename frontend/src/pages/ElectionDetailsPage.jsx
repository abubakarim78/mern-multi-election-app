import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useElectionStore from '@/store/useElectionStore';
import useAuthStore from '@/store/useAuthStore';
import { format } from 'date-fns';
import { Calendar, Users, Info, Clock, Vote } from 'lucide-react';

function ElectionDetailsPage() {
  const { id } = useParams();
  const { getElectionById, currentElection, loading, error, getElectionImageUrl, castVote } = useElectionStore();
  const { user } = useAuthStore();
  const [election, setElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const imageUrl = useMemo(() => {
    return getElectionImageUrl(id);
  }, [id, getElectionImageUrl]);

  useEffect(() => {
    if (id) {
      getElectionById(id);
    }


  }, [id, getElectionById]);

  useEffect(() => {
    if (currentElection && currentElection._id === id) {
      setElection(currentElection);
    }
  }, [currentElection, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading election details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg max-w-md">
          <p className="text-red-800 font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Election not found.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return dateString ? format(new Date(dateString), 'PPP') : 'N/A';
  };

  const isElectionActive = () => {
    if (!election) return false;
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    return now >= startDate && now <= endDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all hover:shadow-2xl">
          {imageUrl && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={imageUrl}
                alt={election.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {election.title}
                </h1>
              </div>
            </div>
          )}
          
          {!imageUrl && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12">
              <h1 className="text-5xl font-bold text-white mb-2">
                {election.title}
              </h1>
            </div>
          )}

          {/* Description Section */}
          <div className="p-8">
            <div className="flex items-start gap-3 mb-8">
              <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-lg leading-relaxed">
                {election.description}
              </p>
            </div>

            {/* Date Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Start Date</h2>
                </div>
                <p className="text-gray-700 text-xl font-medium ml-11">
                  {formatDate(election.startDate)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">End Date</h2>
                </div>
                <p className="text-gray-700 text-xl font-medium ml-11">
                  {formatDate(election.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Candidates</h2>
          </div>

          {election.candidates && election.candidates.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {election.candidates.map((candidate, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 transition-all hover:shadow-lg hover:scale-105 hover:border-blue-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {candidate.avatar ? (
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                          {candidate.name.charAt(0)}
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-800">
                        {candidate.name}
                      </h3>
                    </div>
                    {candidate.motto && (
                      <p className="text-gray-500 italic text-sm ml-13 mb-2">({candidate.motto})</p>
                    )}
                    <p className="text-gray-600 font-medium ml-13 bg-white px-3 py-1 rounded-full inline-block text-sm">
                      {candidate.party}
                    </p>
                    {user && (
                      <div className="mt-4">
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          disabled={!isElectionActive()}
                          className={`w-full cursor-pointer flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            selectedCandidate?._id === candidate._id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                        >
                          <Vote className="h-4 w-4" />
                          <span>{selectedCandidate?._id === candidate._id ? 'Selected' : 'Select'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {user && selectedCandidate && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => castVote(id, selectedCandidate._id)}
                    disabled={!isElectionActive()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isElectionActive() ? `Cast Your Vote for ${selectedCandidate.name}` : 'Voting is not open'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No candidates listed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ElectionDetailsPage;
