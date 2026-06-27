import {Router} from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { loginSchema, registerSchema } from '../../validators/auth.validator.js';
import * as authController from '../controllers/auth.controller.js'
import validate from '../middlewares/validate.middleware.js';



const router = Router()

router
    .route('/register')
    .post(validate(registerSchema),authController.register)

router
    .route('/login')
    .post(validate(loginSchema),authController.login)

router
    .route('/refresh')
    .post(authController.refreshToken)

router.use(authMiddleware)

router  
    .route('/logout')
    .post(authController.logout)

router
    .route('/logout-all')
    .post(authController.logoutAllDevices)

router
    .route('/me')
    .get(authController.getMe)


export default router;