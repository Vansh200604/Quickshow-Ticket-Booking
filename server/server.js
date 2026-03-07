import express from 'express';
import cors from 'cors';   // for we can connect the backend to any frontend
import dotenv from 'dotenv/config.js'
import mongoose from 'mongoose'; // for connecting to the database
import connectDB from './config/db.js';
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from './inngest/index.js';

const app = express();
const port = 3000;

await connectDB();

//Middleware
app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());


// API Routes
app.get('/', (req, res) => res.send('Server is Live!'));

// Protected Route
app.get('api/protected', requireAuth, async(req, res) => {
    const {userId} = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    return res.json({message: `Welcome ${user.firstName} ${user.lastName}! This is a protected route.`});
});

app.use('api/inngest', serve({client: inngest, functions}))

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));