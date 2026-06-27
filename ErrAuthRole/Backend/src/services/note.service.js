import noteRepository from '../repositories/note.repository.js';
import AppError from '../utils/AppError.js';
import { ROLES } from '../constants/index.js';
import logger from '../utils/logger.js';

const noteService = {
  createNote: async (data, userId) => {
    const noteData = {
      ...data,
      owner: userId,
    };

    const note = await noteRepository.create(noteData);

    logger.info(`Note created: ${note._id} by user: ${userId}`);

    return note;
  },

  getAllNotes: async (userId, userRole) => {
    if (userRole === ROLES.ADMIN) {
      return await noteRepository.findAll();
    }

    return await noteRepository.findByOwner(userId);
  },

  getNoteById: async (noteId, userId, userRole) => {
    const note = await noteRepository.findById(noteId);

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    const ownerId = note.owner._id
      ? note.owner._id.toString()
      : note.owner.toString();

    if (userRole !== ROLES.ADMIN && ownerId !== userId.toString()) {
      throw new AppError('You are not authorized to access this note', 403);
    }

    return note;
  },

  updateNote: async (noteId, data, userId, userRole) => {
    const note = await noteRepository.findById(noteId);

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    const ownerId = note.owner._id
      ? note.owner._id.toString()
      : note.owner.toString();

    if (userRole !== ROLES.ADMIN && ownerId !== userId.toString()) {
      throw new AppError('You are not authorized to update this note', 403);
    }

    const updatedNote = await noteRepository.updateById(noteId, data);

    logger.info(`Note updated: ${noteId} by user: ${userId}`);

    return updatedNote;
  },

  deleteNote: async (noteId, userId, userRole) => {
    const note = await noteRepository.findById(noteId);

    if (!note) {
      throw new AppError('Note not found', 404);
    }

    const ownerId = note.owner._id
      ? note.owner._id.toString()
      : note.owner.toString();

    if (userRole !== ROLES.ADMIN && ownerId !== userId.toString()) {
      throw new AppError('You are not authorized to delete this note', 403);
    }

    await noteRepository.deleteById(noteId);

    logger.info(`Note deleted: ${noteId} by user: ${userId}`);

    return note;
  },
};

export default noteService;
