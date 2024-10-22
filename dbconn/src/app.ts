import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth'; 
import graphRoutes from './routes/graph'; 
import { connectToDatabase } from './pool'; 

dotenv.config();

const app: Application = express();

// Middleware configuration
const configureMiddleware = (app: Application) => {
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', 
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }));
};

// Centralized Error Handling Middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
};

// Apply middleware
configureMiddleware(app);

app.use('/api/auth', authRoutes);
app.use('/api/graph', graphRoutes);
// Apply error handling middleware
app.use(errorHandler);

// Connect to the database
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
