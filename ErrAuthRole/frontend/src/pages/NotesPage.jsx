import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getNotes, createNote, updateNote, deleteNote } from '../api/noteApi';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Purpose: Page to manage notes (CRUD).
 */
const NotesPage = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await getNotes();
            setNotes(res.data);
        } catch (error) {
            // Ignored, global interceptor handles it
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCreateUpdate = async (data) => {
        try {
            if (editingNote) {
                await updateNote(editingNote._id, data);
            } else {
                await createNote(data);
            }
            setIsModalOpen(false);
            setEditingNote(null);
            fetchNotes();
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || 'Validation failed');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await deleteNote(id);
                fetchNotes();
            } catch (error) {
                if (error.response?.status === 400) {
                    toast.error(error.response?.data?.message || 'Validation failed');
                }
            }
        }
    };

    const openCreateModal = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">My Notes</h1>
                <button onClick={openCreateModal} className="btn btn-primary">Create Note</button>
            </div>

            {notes.length === 0 ? (
                <div className="empty-state">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h3>No notes found</h3>
                    <p className="text-secondary">Create your first note to get started.</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {notes.map(note => (
                        <NoteCard 
                            key={note._id} 
                            note={note} 
                            currentUser={user}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <NoteForm 
                    initialData={editingNote} 
                    onSubmit={handleCreateUpdate} 
                    onCancel={closeModal} 
                />
            )}
        </div>
    );
};

export default NotesPage;
