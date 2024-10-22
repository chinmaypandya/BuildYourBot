import { Request, Response } from 'express';
import { Graph, alg } from 'graphlib';
import {pool} from '../pool'; // Ensure this points to your pool setup
import { v4 as uuidv4 } from 'uuid';

// Interfaces for node and pipeline data structures
interface NodeData {
    id: string;
    persona: string;
    dos: string[];
    donts: string[];
    example: string;
    name: string;
}

interface PipelineData {
    nodes: NodeData[];
    edges: { source: string; target: string; sourceName:string;targetName:string }[];
    name: string;
    description: string; 
    userId: string;
}

// SQL Queries
const INSERT_GRAPH_QUERY = `
    INSERT INTO graphs (id, user_id, name, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
`;

const INSERT_NODE_QUERY = `
    INSERT INTO nodes (id, parent_id, persona, dos, donts, example, name, graph_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`;

const SELECT_NODES_QUERY = `
    SELECT id, parent_id, persona, dos, donts, example, name
    FROM nodes
    WHERE graph_id = $1;
`;

const SELECT_EDGES_QUERY = `
    SELECT source, target, source_id, target_id
    FROM edges
    WHERE graph_id = $1;
`;
const INSERT_EDGE_QUERY = `
    INSERT INTO edges (graph_id, source_id,target_id, source, target, sourceName, targetName)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
`;


export const createGraph = async (req: Request, res: Response): Promise<void> => {
    const { name, description, userId, nodes, edges }: PipelineData = req.body;
    // console.log('Received nodes:', nodes);
    // console.log('Received edges:', edges);

    const graph = new Graph();
    const nodeDataMap = new Map<string, NodeData>();

    nodes.forEach(node => {
        nodeDataMap.set(node.id, node);
        graph.setNode(node.id);
    });

    edges.forEach(edge => {
        graph.setEdge(edge.source, edge.target);
    });

    const isDAG = alg.isAcyclic(graph);
    const roots = graph.nodes().filter(node => {
        const edges = graph.inEdges(node);
        return edges && edges.length === 0; 
    });    
    const hierarchy = isDAG ? buildHierarchy(graph, roots, nodeDataMap) : [];

    const graphId = uuidv4();
    try {
        const graphResult = await pool.query(INSERT_GRAPH_QUERY, [graphId, userId, name, description]);
        await storeHierarchyInDB(hierarchy, null, graphResult.rows[0].id);
        const nodesResult = await pool.query(SELECT_NODES_QUERY, [graphId]);

         // Store edges in DB
         const nodesMap = new Map(nodesResult.rows.map(node => [node.name, node.id])); // Create a map of node names to IDs

        //  console.log(nodesMap);
         for (const edge of edges) {
             const sourceNodeId = nodesMap.get(edge.sourceName); // Get node ID for source
             const targetNodeId = nodesMap.get(edge.targetName); // Get node ID for target
             
             // Insert edge with graph ID, source node ID, and target node ID
             if (sourceNodeId && targetNodeId) {
                 await pool.query(INSERT_EDGE_QUERY, [graphId, sourceNodeId,targetNodeId, edge.source, edge.target,edge.sourceName,edge.targetName]);
             }
         }
        if (nodesResult.rows.length > 0) {
            res.json({ graphId, nodes: nodesResult.rows, numNodes: nodes.length, numEdges: edges.length, isDAG, hierarchy });
        } else {
            res.status(404).json({ error: 'No nodes found for the provided graph ID' });
        }
    } catch (error) {
        console.error('Error storing graph or hierarchy in database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


async function storeHierarchyInDB(hierarchy: any[], parentId: string | null, graphId: string): Promise<void> {
    for (const node of hierarchy) {
        const { parent, children } = node;
        const newNodeId = uuidv4();

        const values = [
            newNodeId,
            parentId,
            parent.data.persona || null,
            parent.data.dos,
            parent.data.donts,
            parent.data.example,
            parent.data.name,
            graphId
        ];
        await pool.query(INSERT_NODE_QUERY, values);

        if (children.length > 0) {
            await storeHierarchyInDB(children, newNodeId, graphId);
        }
    }
}

function buildHierarchy(graph: Graph, roots: string[], nodeDataMap: Map<string, NodeData>): any[] {
    const hierarchy: any[] = [];

    function recurse(node: string): any {
        const children = graph.successors(node) || [];
        const nodeData = nodeDataMap.get(node);
        return {
            parent: nodeData,
            children: children.map(recurse)
        };
    }

    roots.forEach(root => {
        hierarchy.push(recurse(root));
    });

    return hierarchy;
}


export const getGraphById = async (req: Request, res: Response): Promise<void> => {
    const { graphId } = req.params;

    try {
        const result = await pool.query(SELECT_NODES_QUERY, [graphId]);
        const edgeresult = await pool.query(SELECT_EDGES_QUERY, [graphId]);
        if (result.rows.length > 0) {
            res.json({ graphId, nodes: result.rows , edges:edgeresult.rows});
        } else {
            res.status(404).json({ error: 'No nodes found for the provided graph ID' });
        }
    } catch (error) {
        console.error('Error retrieving nodes from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

