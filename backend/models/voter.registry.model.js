import mongoose from "mongoose";

const voterRegistrySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
});

const VoterRegistry = mongoose.model("VoterRegistry", voterRegistrySchema);

export default VoterRegistry;
