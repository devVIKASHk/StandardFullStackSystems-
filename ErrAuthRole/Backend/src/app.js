import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import routes from './routes/index.js'
import globalErrorHandler from './middlewares/error.middleware.js';
import AppError from './utils/AppError.js';
import requestLogger from './middlewares/requestLogger.middleware.js';

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

app.use(requestLogger)
app.use(routes);


app.use((req,res,next)=>{
    next(new AppError(`Route ${req.originalUrl} not found`,404))
});

app.use(globalErrorHandler);


export default app;