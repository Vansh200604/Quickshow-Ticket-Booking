import express from 'express';
import cors from 'cors';   // for we can connect the backend to any frontend
import dotenv from 'dotenv/config.js'
import mongoose from 'mongoose'; // for connecting to the database
import connectDB from './config/db.js';
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from './inngest/index.js';
import showRouter from './routers/showRouters.js';
import bookingRouter from './routers/bookingRouter.js';
import adminRouter from './routers/adminRouter.js';
import userRouter from './routers/userRouter.js';
import { stripeWebhooks } from './controllers/stripeWebHooks.js';

const app = express();
const port = 3000;

await connectDB();

// Stripe webhook endpoint (must be BEFORE express.json())
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhooks);

//Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());    


// API Routes
app.get('/', (req, res) => res.send('Server is Live!'));

// Protected Route
app.get('/api/protected', requireAuth, async(req, res) => {
    const {userId} = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    return res.json({message: `Welcome ${user.firstName} ${user.lastName}! This is a protected route.`});
});

app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));