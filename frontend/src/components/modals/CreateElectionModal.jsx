import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import useElectionStore from "@/store/useElectionStore";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

function CreateElectionModal({
  newElectionModalOpen,
  setNewElectionModalOpen,
}) {
  const { createElection, isCreatingElection } = useElectionStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    image: null,
    voterEmails: "",
  });
  const [candidates, setCandidates] = useState([{ name: "", party: "", motto: "", avatar: null }]);
  const [generatedPincode, setGeneratedPincode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCandidateChange = (index, e) => {
    const { name, value, files } = e.target;
    const list = [...candidates];
    if (name === "avatar") {
      list[index][name] = files[0];
    } else {
      list[index][name] = value;
    }
    setCandidates(list);
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, { name: "", party: "", motto: "", avatar: null }]);
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
    data.append("voterEmails", formData.voterEmails);
    if (formData.image) {
      data.append("image", formData.image);
    }

    const candidatesWithoutAvatars = candidates.map(c => {
      const { avatar, ...rest } = c;
      return rest;
    });

    data.append("candidates", JSON.stringify(candidatesWithoutAvatars));

    candidates.forEach(candidate => {
      if (candidate.avatar) {
        data.append("candidate_avatars", candidate.avatar);
      }
    });
    
    const createdElection = await createElection(data);

    if (createdElection) {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        image: null,
        voterEmails: "",
      });
      setCandidates([{ name: "", party: "", motto: "", avatar: null }]);
      setGeneratedPincode(createdElection.pincode);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPincode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closePincodeModal = () => {
    setGeneratedPincode(null);
    setNewElectionModalOpen(false);
  };

  if (generatedPincode) {
    return (
      <Dialog open={true} onOpenChange={closePincodeModal}>
        <DialogContent className="bg-white border-0 shadow-xl sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Election Created!
            </h2>
            <p className="text-center text-sm text-gray-600">
              Here is your election pincode. Please save it securely.
            </p>
          </DialogHeader>
          <div className="mt-4">
            <div className="relative rounded-lg bg-gray-100 p-4">
              <p className="text-center font-mono text-lg tracking-widest text-gray-800">
                {generatedPincode}
              </p>
              <button
                onClick={handleCopy}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-2 text-gray-500 hover:bg-gray-200"
              >
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={closePincodeModal}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={newElectionModalOpen} onOpenChange={setNewElectionModalOpen}>
      <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-2xl max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
        <DialogHeader className="text-center pb-6 border-b border-gray-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Election
          </h2>
          <p className="text-gray-600 mt-2">Set up your democratic process</p>
        </DialogHeader>

        <div className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... form fields ... */}
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

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Voter Emails (comma-separated)
              </label>
              <textarea
                name="voterEmails"
                placeholder="e.g., voter1@example.com, voter2@example.com"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 resize-none bg-white/80 backdrop-blur-sm"
                onChange={handleChange}
                value={formData.voterEmails}
              />
            </div>

            {/* Candidates */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Candidates
              </label>
              {candidates.map((candidate, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center gap-4">
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
                  <input
                    type="text"
                    name="motto"
                    placeholder="Candidate Motto"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                    value={candidate.motto}
                    onChange={(e) => handleCandidateChange(index, e)}
                  />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    onChange={(e) => handleCandidateChange(index, e)}
                  />
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
                Upload an image to represent your election (optional)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setNewElectionModalOpen(false)}
                className="flex-1 cursor-pointer px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingElection}
                className="flex-1 cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingElection ? "Creating..." : "Create Election"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateElectionModal;
