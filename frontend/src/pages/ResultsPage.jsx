import React, { useEffect } from "react";
import useElectionStore from "@/store/useElectionStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Users, TrendingUp } from 'lucide-react';

function ResultsPage() {
  const { elections, fetchElectionResults, loading } = useElectionStore();

  useEffect(() => {
    fetchElectionResults();
  }, [fetchElectionResults]);

  const getTotalVotes = (candidates) => {
    return candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  };

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-medium">{payload[0].value} votes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Election Results</h1>
          <p className="text-gray-600 text-lg">Voting statistics and outcomes</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading election results...</p>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">No elections available yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {elections.map((election, index) => {
              const totalVotes = getTotalVotes(election.candidates);
              const isEnded = new Date(election.endDate) < new Date();

              return (
                <div 
                  key={election._id} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Election Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{election.title}</h2>
                    <div className="flex items-center gap-6 text-blue-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{election.candidates?.length || 0} Candidates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium">{totalVotes} Total Votes</span>
                      </div>
                    </div>
                  </div>

                  {/* Winner Banner */}
                  {isEnded && election.winner && totalVotes > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-200 p-4">
                      <div className="flex items-center justify-center gap-3">
                        <Trophy className="w-6 h-6 text-green-600" />
                        <span className="text-lg font-semibold text-gray-800">
                          Winner: <span className="text-green-700">{election.winner.name}</span> with {election.winner.votes} votes
                          <span className="text-gray-600 ml-2">
                            ({((election.winner.votes / totalVotes) * 100).toFixed(1)}%)
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Leading Candidate Banner */}
                  {!isEnded && totalVotes > 0 && (
                     <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200 p-4">
                       <div className="flex items-center justify-center gap-3">
                         <Trophy className="w-6 h-6 text-yellow-600" />
                         <span className="text-lg font-semibold text-gray-800">
                           Leading: <span className="text-yellow-700">{election.candidates.reduce((p, c) => p.votes > c.votes ? p : c).name}</span>
                         </span>
                       </div>
                     </div>
                  )}

                  {/* Chart Section */}
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={election.candidates} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#6b7280', fontSize: 14 }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis 
                          tick={{ fill: '#6b7280', fontSize: 14 }}
                          axisLine={{ stroke: '#d1d5db' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="circle"
                        />
                        <Bar 
                          dataKey="votes" 
                          radius={[8, 8, 0, 0]}
                          name="Votes"
                        >
                          {election.candidates.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Candidate Details */}
                  <div className="px-6 pb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {election.candidates
                        .sort((a, b) => b.votes - a.votes)
                        .map((candidate, idx) => (
                          <div 
                            key={idx}
                            className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                              {idx === 0 && totalVotes > 0 && (
                                <Trophy className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-2xl font-bold text-blue-600">{candidate.votes}</span>
                              <span className="text-sm text-gray-600">votes</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0}%`,
                                  backgroundColor: colors[idx % colors.length]
                                }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0}% of total votes
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
