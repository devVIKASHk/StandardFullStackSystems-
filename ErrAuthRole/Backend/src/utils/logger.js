import pino from 'pino';
import config from '../config/env.js'


const logger = pino({
    level:config.nodeEnv==='development'?'debug':'info',

    ...(config.nodeEnv==='development' && {
        transport:{
            target:'pino-pretty',
            options:{
                colorize:true
            }
        }
    })
})

export default logger; 
