import express from 'express';
import multer from 'multer';
import {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
  getElectionImage,
  getElectionResults,
  castVote
} from '../controllers/election.controllers.js';
import { protect, isElectionOfficial } from '../middleware/auth.middleware.js';

const electionRouter = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'candidate_avatars' }
]);

// Route to create a new election (with file upload)
electionRouter.post('/', protect, isElectionOfficial, uploadFields, createElection);

// Route to get all elections
electionRouter.get('/', getElections);

// Route to get election results
electionRouter.get('/results', getElectionResults);

// Route to get a specific election by ID
electionRouter.get('/:id', getElectionById);

// Route to get election image by ID
electionRouter.get('/:id/image', getElectionImage);

// Route to update an existing election by ID (with file upload)
electionRouter.put('/:id', protect, isElectionOfficial, upload.single('bannerImage'), updateElection);

// Route to delete an election by ID
electionRouter.delete('/:id', protect, isElectionOfficial, deleteElection);

// Route to cast a vote in an election
electionRouter.post('/:id/vote', protect, castVote);

export default electionRouter;
