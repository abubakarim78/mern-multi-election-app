import Election from "../models/election.model.js";

export const createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate, candidates } = req.body;

    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { title, description, startDate, endDate, candidates }
      });
    }

    let parsedCandidates = candidates ? JSON.parse(candidates) : [];

    if (req.files && req.files.candidate_avatars) {
      parsedCandidates = parsedCandidates.map((candidate, index) => {
        const avatar = req.files.candidate_avatars[index];
        if (avatar) {
          return {
            ...candidate,
            avatar: {
              data: avatar.buffer,
              contentType: avatar.mimetype,
            }
          };
        }
        return candidate;
      });
    }

    const pincode = Math.floor(100000 + Math.random() * 900000).toString();

    const electionData = {
      title,
      description,
      startDate,
      endDate,
      candidates: parsedCandidates,
      pincode,
    };

    // Handle image if uploaded
    if (req.files && req.files.image) {
      electionData.image = {
        data: req.files.image[0].buffer,
        contentType: req.files.image[0].mimetype,
        filename: req.files.image[0].originalname,
      };
    }

    const newElection = new Election(electionData);
    
    await newElection.save();
    
    // Return without image data for performance
    const response = newElection.toObject();
    delete response.image;
    if (response.candidates) {
      response.candidates.forEach(c => delete c.avatar);
    }
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getElections = async (req, res) => {
  try {
    const elections = await Election.find().select('-pincode');
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getElectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id).select('-pincode');
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const electionObject = election.toObject();
    if (electionObject.candidates) {
      electionObject.candidates.forEach(candidate => {
        if (candidate.avatar && candidate.avatar.data) {
          candidate.avatar = `data:${candidate.avatar.contentType};base64,${candidate.avatar.data.toString('base64')}`;
        }
      });
    }

    res.status(200).json(electionObject);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const verifyPincode = async (req, res) => {
  try {
    const { id } = req.params;
    const { pincode } = req.body;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (election.pincode !== pincode) {
      return res.status(401).json({ message: "Invalid pincode" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getElectionImage = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);
    if (!election || !election.image || !election.image.data) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.set("Content-Type", election.image.contentType);
    res.send(election.image.data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, candidates } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (startDate) updates.startDate = startDate;
    if (endDate) updates.endDate = endDate;
    if (candidates) updates.candidates = JSON.parse(candidates);

    // Handle image if uploaded
    if (req.file) {
      updates.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      };
    }

    const election = await Election.findByIdAndUpdate(
      id,
      updates, 
      { new: true }
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findByIdAndDelete(id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.status(200).json({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getElectionResults = async (req, res) => {
  try {
    const elections = await Election.find().select("-image");

    const results = elections.map(election => {
      const electionObject = election.toObject();
      const now = new Date();
      const endDate = new Date(election.endDate);

      if (now > endDate) {
        let winner = null;
        let maxVotes = -1;

        election.candidates.forEach(candidate => {
          if (candidate.votes > maxVotes) {
            maxVotes = candidate.votes;
            winner = candidate;
          }
        });

        // Handle ties
        const tiedCandidates = election.candidates.filter(c => c.votes === maxVotes);
        if (tiedCandidates.length > 1) {
          winner = { name: "Tie", party: "N/A", votes: maxVotes };
        }
        
        electionObject.winner = winner;
      }

      return electionObject;
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const castVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidateId } = req.body;
    const userId = req.user._id;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
      return res.status(400).json({ message: "This election has not started yet" });
    }

    if (now > endDate) {
      return res.status(400).json({ message: "This election has ended" });
    }

    const candidate = election.candidates.find(
      (c) => c._id.toString() === candidateId
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (election.voters.includes(userId)) {
      return res.status(400).json({ message: "You have already voted in this election" });
    }

    candidate.votes += 1;
    election.voters.push(userId);

    await election.save();

    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};