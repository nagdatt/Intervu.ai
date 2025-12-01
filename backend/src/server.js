import express from 'express';
import { ENV } from './lib/env.js';
import path from 'path';
import { connectDB } from './lib/db.js';
const app = express();
const __dirname = path.resolve();


app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'api is up and running'
    });
});
app.get('/books', (req, res) => {
    res.status(200).json({
        message: 'books route'
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