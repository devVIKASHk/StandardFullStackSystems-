import {Router} from 'express';

import authRoute from './auth.route.js'
import userRoute from './user.route.js'
import noteRoute from './note.route.js'

const router = Router()

router.use('/auth',authRoute);
router.use('/users',userRoute);
router.use('/notes', noteRoute);


export default router;