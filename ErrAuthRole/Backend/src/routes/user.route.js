import {Router} from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { ROLES } from '../constants/index.js';
import uthorizedRoles from '../middlewares/role.middleware.js';
import * as userController from '../controllers/user.controller.js'


const router = Router();


router.use(authMiddleware);

router
    .route('/profile')
    .patch(userController.updateProfile);


router.use(authorizedRoles(ROLES.ADMIN));

router 
    .route('/')
    .get(userController.getAllUsers)
router  
    .route('/:id')
    .delete(userController.deleteUser)


export default router;