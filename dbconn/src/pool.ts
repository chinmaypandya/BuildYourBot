import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL; 

const pool = new Pool({
    connectionString, 
});
const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('Database connected successfully!');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};




export { pool, connectToDatabase }