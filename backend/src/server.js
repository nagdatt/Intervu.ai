import express from 'express';
import { ENV } from './lib/env.js';
import path from 'path';
import { connectDB } from './lib/db.js';
import cors from 'cors';
const app = express();
const __dirname = path.resolve();
import {serve} from "inngest/express";
import { inngest ,functions} from './lib/inngest.js';

import {clerkMiddleware} from "@clerk/express";
import { protectRoute } from './middleware/protectRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

//middlewares
app.use(express.json());
//credentials:true to enable cookies in cors
app.use(cors({origin:ENV.CLIENT_URL,Credentials:true}));
app.use(clerkMiddleware())// this adds  auth field to reques object:req.auth()

app.use("/api/inngest",serve({client:inngest,functions,signingKey:ENV.INNGEST_SIGNING_KEY}));
app.use('/api/chat',chatRoutes)
app.use('/api/sessions',sessionRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'api is up and running'
    });
});


// make our app deployement ready
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}


const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log('Server is running on port 3000');
        });
    }
    catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
}
startServer();