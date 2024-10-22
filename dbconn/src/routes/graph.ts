
import express from 'express';
import {createGraph, getAllGraphs, getGraphById } from '../controllers/graph'; 
const router = express.Router();

/**
 * POST route to submit a new graph.
 * @route POST /create
 * @access Public
 */
router.post('/create', createGraph);

/**
 * GET route to fetch a specific graph by graphId.
 * @route GET /:graphId
 * @access Public
 */
router.get('/:graphId', getGraphById);

/**
 * GET route to fetch all graphs for a specific user by userId.
 * @route GET /user/:userId
 * @access Public
 */
router.get('/user/:userId', getAllGraphs);

export default router;
