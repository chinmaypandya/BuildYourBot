
import express from 'express';
import {createGraph, getGraphById } from '../controllers/graph'; 
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


export default router;
