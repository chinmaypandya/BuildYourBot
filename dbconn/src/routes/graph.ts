
import express from 'express';
import {createGraph } from '../controllers/graph'; 
const router = express.Router();

/**
 * POST route to submit a new graph.
 * @route POST /submit
 * @access Public
 */
router.post('/create', createGraph);



export default router;
