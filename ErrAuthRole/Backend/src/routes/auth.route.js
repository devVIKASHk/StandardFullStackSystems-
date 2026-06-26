import {Router} from 'express';
import authMiddleware from '../middlewares/auth.middleware';




const router = Router()

router
    .route('/register')
    .post()

router
    .route('/login')
    .post()

router
    .route('/refresh')
    .post()

router.use(authMiddleware)

router  
    .route('/logout')
    .post()

router
    .route('/logout-all')
    .post()

router
    .route('/me')
    .get()


export default router;