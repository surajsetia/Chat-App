import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';


import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON request bodies (from req.body)
app.use(cookieParser()); // Middleware to parse cookies (from req.cookies)


app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


/*app.get("/", (req, res) => {
  // root route http://localhost:5000/
  res.send("API is running...");
});*/


server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
