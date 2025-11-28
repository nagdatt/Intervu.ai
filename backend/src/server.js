import express from 'express';
import {ENV} from './lib/env.js';
const app=express();
app.get('/health',(req,res)=>{
    res.status(200).json({
        message:'api is up and running'
    });
});

app.listen(3000,()=>{
    console.log('Server is running on port 8000');
});