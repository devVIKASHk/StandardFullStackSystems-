import Note from '../models/note.model.js';

const noteRepository = {
  create: async (data) => {
    return await Note.create(data);
  },

  findByOwner: async (ownerId) => {
    return await Note.find({ owner: ownerId }).sort('-createdAt');
  },

  findAll: async () => {
    return await Note.find()
      .populate('owner', 'name email')
      .sort('-createdAt');
  },

  findById: async (id) => {
    return await Note.findById(id).populate('owner', 'name email');
  },

  updateById: async (id, data) => {
    return await Note.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  deleteById: async (id) => {
    return await Note.findByIdAndDelete(id);
  },
};

export default noteRepository;
