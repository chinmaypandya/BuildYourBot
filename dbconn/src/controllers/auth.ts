// controllers/authController.ts

import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseKey = process.env.REACT_APP_SUPABASE_API as string;
const JWT_SECRET = process.env.JWT_SECRET as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define interfaces for request bodies
interface LoginRequestBody {
  email: string;
  password: string;
}

interface RegisterRequestBody {
  email: string;
  password: string;
  username: string;
}

// Define the payload structure for JWT
interface TokenPayload {
  userId: string;
}

/**
 * Login Controller
 * Handles user login and creates session tokens.
 */
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  // Attempt to log in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  // Handle login errors
  if (error || !data.session || !data.user) {
    console.error('Login error:', error);
    res.status(401).json({ error: error?.message || 'Invalid credentials' });
    return;
  }

  const token = data.session.access_token;

  // Check if the user exists in the database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  // If the user does not exist, create a new user record
  if (!userData) {
    const newUserId = uuidv4();
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: newUserId,
        username: data.user.user_metadata.name, // Username from user metadata
        email: data.user.user_metadata.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    // Handle errors during user insertion
    if (insertError) {
      console.error('Error inserting user:', insertError);
      res.status(500).json({ error: 'Could not create user record.' });
      return;
    }
  }

  // Create a JWT session token
  const sessionToken = jwt.sign({ userId: data.user.id } as TokenPayload, JWT_SECRET, { expiresIn: '1d' });

  // Set cookies for access token and session token
  res.cookie('access_token', token);
  res.cookie('session_token', sessionToken);

  res.status(200).json({ message: 'Login successful'});
};

/**
 * Registration Controller
 * Handles user registration and creates a user record.
 */
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  const { email, password, username } = req.body;

  // Validate input
  if (!email || !password || !username) {
    res.status(400).json({ error: 'Email, password, and username are required.' });
    return;
  }

  // Check if the user already exists
  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  // Return an error if the user already exists
  if (existingUser && existingUser.id) {
    res.status(409).json({ error: 'User already exists.' });
    return;
  }

  // Sign up the user with Supabase
  const { data, error } = await supabase.auth.signUp({ email, password });

  // Handle signup errors
  if (error || !data.user) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error?.message || 'Registration failed.' });
    return;
  }

  const newUserId = uuidv4();

  // Insert the new user into the database
  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id: newUserId,
      username,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  // Handle errors during user insertion
  if (insertError) {
    console.error('Error inserting user:', insertError);
    res.status(500).json({ error: 'Could not create user record.' });
    return;
  }

  // Create a session token
  const sessionToken = jwt.sign({ userId: data.user.id } as TokenPayload, JWT_SECRET, { expiresIn: '1d' });

  // Set session token cookie
  res.cookie('session_token', sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  res.status(201).json({ message: 'Registration successful' });
};

/**
 * Logout Controller
 * Handles user logout and clears session cookies.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // Sign out the user from Supabase
  const { error } = await supabase.auth.signOut();

  // Handle sign out errors
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // Clear cookies
  res.clearCookie('access_token');
  res.clearCookie('session_token');

  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Check Session Controller
 * Validates the current user session using the access token.
 */
export const checkSession = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.access_token;

  // Check if the access token is provided
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  // Retrieve the session from Supabase
  const { data, error } = await supabase.auth.getSession();

  // Handle session retrieval errors
  if (error || !data.session) {
    const errorMessage = error ? error.message : 'Session not found';
    res.status(401).json({ error: errorMessage });
    return;
  }

  res.status(200).json({ session: data.session });
};

/**
 * Google OAuth Controller
 * Initiates Google OAuth sign-in process.
 */
export const google = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/success', // Change this to your production URL
      },
    });

    // Handle errors during OAuth sign-in
    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
