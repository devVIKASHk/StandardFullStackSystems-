import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/env.js';


const app = express();

app.use(helmet({
    contentSecurityPolicy:false,
    crossOriginResourcePolicy:{
        policy:'cross-origin'
    }
}));

app.use(cors({
    origin:config.corsOrigin,
    credentials:true
}));

app.use(cookieParser());

app.use(express.json({limit:'50kb'}));
app.use(express.urlencoded({extended:true}));


export default app;