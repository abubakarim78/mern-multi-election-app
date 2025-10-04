import mongoose from "mongoose";

const electionOfficialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
  },
  { timestamps: true }
);

const ElectionOfficial = mongoose.model("ElectionOfficial", electionOfficialSchema);

export default ElectionOfficial;