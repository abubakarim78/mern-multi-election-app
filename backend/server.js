import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './database/database.js';
import electionRouter from './routes/election.routes.js';
import authRouter from './routes/auth.routes.js';


dotenv.config();
connectDB();



const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

app.use('/api/elections', electionRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
