import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import useElectionStore from "@/store/useElectionStore";

function UpdateElectionModal({
  updateElectionModalOpen,
  setUpdateElectionModalOpen,
  electionToUpdate,
}) {
  const { updateElection, isUpdatingElection } = useElectionStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    image: null,
  });
  const [candidates, setCandidates] = useState([{ name: "", party: "" }]);

  useEffect(() => {
    if (electionToUpdate) {
      setFormData({
        title: electionToUpdate.title,
        description: electionToUpdate.description,
        startDate: new Date(electionToUpdate.startDate).toISOString().split("T")[0],
        endDate: new Date(electionToUpdate.endDate).toISOString().split("T")[0],
        image: null,
      });
      setCandidates(electionToUpdate.candidates.map(c => ({ name: c.name, party: c.party })));
    }
  }, [electionToUpdate]);

  const handleCandidateChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...candidates];
    list[index][name] = value;
    setCandidates(list);
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, { name: "", party: "" }]);
  };

  const handleRemoveCandidate = (index) => {
    const list = [...candidates];
    list.splice(index, 1);
    setCandidates(list);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("candidates", JSON.stringify(candidates));

    const success = await updateElection(electionToUpdate._id, data);

    if (success) {
      setUpdateElectionModalOpen(false);
    }
  };

  return (
    <Dialog open={updateElectionModalOpen} onOpenChange={setUpdateElectionModalOpen}>
      <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-2xl max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
        <DialogHeader className="text-center pb-6 border-b border-gray-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Update Election
          </h2>
          <p className="text-gray-600 mt-2">Modify the details of your election</p>
        </DialogHeader>

        <div className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Election Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Election Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Student Council Presidential Election"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                onChange={handleChange}
                value={formData.title}
                required
              />
            </div>

            {/* Election Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Election Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the purpose and scope of this election..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 resize-none bg-white/80 backdrop-blur-sm"
                onChange={handleChange}
                value={formData.description}
                required
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                  onChange={handleChange}
                  value={formData.startDate}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                  onChange={handleChange}
                  value={formData.endDate}
                  required
                />
              </div>
            </div>

            {/* Candidates */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Candidates
              </label>
              {candidates.map((candidate, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Candidate Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    name="party"
                    placeholder="Candidate Party"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                    value={candidate.party}
                    onChange={(e) => handleCandidateChange(index, e)}
                    required
                  />
                  {candidates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCandidate(index)}
                      className="px-3 py-2 text-red-500 bg-red-100 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCandidate}
                className="w-full px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
              >
                Add Candidate
              </button>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Election Banner
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
                  }
                />
              </div>
              <p className="text-xs text-gray-500">
                Upload a new image to replace the current one (optional)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setUpdateElectionModalOpen(false)}
                className="flex-1 cursor-pointer px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingElection}
                className="flex-1 cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingElection ? "Updating..." : "Update Election"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateElectionModal;