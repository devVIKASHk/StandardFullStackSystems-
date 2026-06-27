import {Router} from 'express';
import * as noteController from '../controllers/note.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import  validate  from '../middlewares/validate.middleware.js';
import { createNoteSchema, updateNoteSchema } from '../validators/note.validator.js';

const router = Router();

router.use(authMiddleware);

router
    .route('/')
    .post(validate(createNoteSchema), noteController.createNote)
    .get(noteController.getAllNotes)

router
    .route('/:id')
    .get(noteController.getNoteById)
    .put(validate(updateNoteSchema), noteController.updateNote)
    .delete(noteController.deleteNote)

export default router;
