import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, MonitorPlay } from "lucide-react";
import ElectionCard from "../components/ElectionCard";
import CreateElectionModal from "@/components/modals/CreateElectionModal";
import UpdateElectionModal from "@/components/modals/UpdateElectionModal";
import useElectionStore from "@/store/useElectionStore";
import useAuthStore from "@/store/useAuthStore";

function ElectionsPage() {
  const {
    elections,
    fetchElections,
    isLoadingElections,
    getElectionImageUrl,
  } = useElectionStore();
  const { user } = useAuthStore();
  const [newElectionModalOpen, setNewElectionModalOpen] = useState(false);
  const [updateElectionModalOpen, setUpdateElectionModalOpen] = useState(false);
  const [electionToUpdate, setElectionToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) return "upcoming";
    if (now > endDate) return "ended";
    return "active";
  };

  const filteredElections = useMemo(() => {
    return elections.filter((election) => {
      const matchesSearch =
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || getElectionStatus(election) === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [elections, searchTerm, filterStatus]);

  const handleEditElection = (election) => {
    setElectionToUpdate(election);
    setUpdateElectionModalOpen(true);
  };

  const getStatusCounts = () => {
    const counts = { all: elections.length, active: 0, upcoming: 0, ended: 0 };
    elections.forEach((election) => {
      const status = getElectionStatus(election);
      counts[status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 text-gray-900 dark:from-gray-900 dark:to-blue-900/20 dark:text-white transition-colors duration-300">
      <div className="w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-2 py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Election Management
                </h1>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Manage and oversee democratic processes with our comprehensive
                  election platform
                </p>
              </div>
              {user && user.role === "Election Official" && (
                <button
                  onClick={() => setNewElectionModalOpen(!newElectionModalOpen)}
                  className="self-start lg:self-center cursor-pointer px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  Create New Election
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search elections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                {[
                  { key: "all", label: "All", count: statusCounts.all },
                  { key: "active", label: "Active", count: statusCounts.active },
                  {
                    key: "upcoming",
                    label: "Upcoming",
                    count: statusCounts.upcoming,
                  },
                  { key: "ended", label: "Ended", count: statusCounts.ended },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      filterStatus === key
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {label}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        filterStatus === key
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-500 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Elections Grid */}
          <div className="space-y-6">
            {isLoadingElections ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredElections.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filterStatus === "all"
                      ? "All Elections"
                      : filterStatus === "active"
                      ? "Active Elections"
                      : filterStatus === "upcoming"
                      ? "Upcoming Elections"
                      : "Ended Elections"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredElections.length} election
                    {filteredElections.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="grid grid-col-3 gap-6">
                  {filteredElections.map((election) => (
                    <ElectionCard
                      key={election._id}
                      election={election}
                      onEdit={handleEditElection}
                      bannerUrl={getElectionImageUrl(election._id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <MonitorPlay className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No elections found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first election."}
                </p>
                {(!searchTerm && filterStatus === "all") && (
                  <button
                    onClick={() => setNewElectionModalOpen(true)}
                    disabled={!user || user.role !== "Election Official"}
                    className="px-6 py-3 bg-blue-600 cursor-pointer text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={!user || user.role !== "Election Official" ? "You do not have permission to create an election." : ""}
                  >
                    <Plus className="w-5 h-5" />
                    Create First Election
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateElectionModal
        newElectionModalOpen={newElectionModalOpen}
        setNewElectionModalOpen={setNewElectionModalOpen}
      />
      {electionToUpdate && (
        <UpdateElectionModal
          updateElectionModalOpen={updateElectionModalOpen}
          setUpdateElectionModalOpen={setUpdateElectionModalOpen}
          electionToUpdate={electionToUpdate}
        />
      )}
    </div>
  );
}

export default ElectionsPage;
