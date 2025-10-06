import api from "@/lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";

const useElectionStore = create((set) => ({
  elections: [],
  currentElection: null,
  loading: false,
  error: null,
  message: null,
  isCreatingElection: false,
  isUpdatingElection: false,
  isDeletingElection: false,
  isRequestingPincode: false,

  getElectionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/elections/${id}`);
      set({ currentElection: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch election", 
        loading: false 
      });
      toast.error(error.response?.data?.message || "Failed to fetch election");
    }
  },

  verifyPincode: async (electionId, pincode) => {
    set({ error: null });
    try {
      const response = await api.post(`/elections/${electionId}/verify`, { pincode });
      return response.data.success;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Pincode verification failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  },

  requestPincode: async (electionId) => {
    set({ isRequestingPincode: true, error: null, message: null });
    try {
      const response = await api.post(`/elections/${electionId}/request-pincode`);
      set({ message: response.data.message, isRequestingPincode: false });
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to request pincode";
      set({ error: errorMessage, isRequestingPincode: false });
      toast.error(errorMessage);
    }
  },

  createElection: async (formData) => {
    set({ isCreatingElection: true });

    try {
      const response = await api.post("/elections", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        elections: [...state.elections, response.data],
        isCreatingElection: false,
      }));

      toast.success("Election created successfully!");
      return response.data; // Return the created election object
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create election");
      set({ isCreatingElection: false });
      return false;
    }
  },

  fetchElections: async () => {
    set({ loading: true });

    try {
      const response = await api.get("/elections");
      
      if (!response.data) {
        set({ loading: false });
        return;
      }

      set({ elections: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching elections:", error);
      set({ loading: false });
      toast.error("Failed to fetch elections");
    }
  },

  fetchElectionById: async (id) => {
    set({ loading: true });

    try {
      const response = await api.get(`/elections/${id}`);
      
      if (!response.data) {
        set({ loading: false });
        return null;
      }

      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching election:", error);
      set({ loading: false });
      return null;
    }
  },

  updateElection: async (id, formData) => {
    set({ isUpdatingElection: true });

    const title = formData.get("title");
    const description = formData.get("description");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (!title || !description || !startDate || !endDate) {
      toast.error("All fields are required");
      set({ isUpdatingElection: false });
      return false;
    }

    try {
      const response = await api.put(`/elections/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        elections: state.elections.map((election) =>
          election._id === id ? response.data : election
        ),
        isUpdatingElection: false,
      }));

      toast.success("Election updated successfully!");
      return response.data;
    } catch (error) {
      console.error("Error updating election:", error);
      toast.error(error.response?.data?.message || "Failed to update election");
      set({ isUpdatingElection: false });
      return false;
    }
  },

  deleteElection: async (id) => {
    set({ isDeletingElection: true });

    try {
      const response = await api.delete(`/elections/${id}`);

      set((state) => ({
        elections: state.elections.filter((election) => election._id !== id),
        isDeletingElection: false,
      }));

      toast.success("Election deleted successfully!");
      return response.data;
    } catch (error) {
      console.error("Error deleting election:", error);
      toast.error(error.response?.data?.message || "Failed to delete election");
      set({ isDeletingElection: false });
      return false;
    }
  },

  fetchElectionResults: async () => {
    set({ loading: true });

    try {
      const response = await api.get("/elections/results");
      
      if (!response.data) {
        set({ loading: false });
        return;
      }

      set({ elections: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching election results:", error);
      set({ loading: false });
      toast.error("Failed to fetch election results");
    }
  },

  getElectionImageUrl: (id) => {
    return `${api.defaults.baseURL}/elections/${id}/image`;
  },

  castVote: async (electionId, candidateId) => {
    set({ loading: true });
    try {
      const response = await api.post(`/elections/${electionId}/vote`, {
        candidateId,
      });
      set({ currentElection: response.data, loading: false });
      toast.success("Vote cast successfully!");
      useElectionStore.getState().fetchElections();
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to cast vote",
        loading: false,
      });
      if (error.response?.data?.message === "You have already voted in this election") {
        toast.error("You have already voted in this election");
      } else {
        toast.error(error.response?.data?.message || "Failed to cast vote");
      }
      return false;
    }
  },
}));

export default useElectionStore;
