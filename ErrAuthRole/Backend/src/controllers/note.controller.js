import noteService from '../services/note.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.body, req.user._id);

  sendSuccess(res, { note }, 'Note created successfully', 201);
});

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getAllNotes(req.user._id, req.user.role);

  sendSuccess(res, { notes }, 'Notes fetched successfully');
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.params.id, req.user._id, req.user.role);

  sendSuccess(res, { note }, 'Note fetched successfully');
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.params.id, req.body, req.user._id, req.user.role);

  sendSuccess(res, { note }, 'Note updated successfully');
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await noteService.deleteNote(req.params.id, req.user._id, req.user.role);

  sendSuccess(res, { note }, 'Note deleted successfully');
});

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
