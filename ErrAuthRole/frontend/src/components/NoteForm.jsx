import { useState, useEffect } from 'react';

/**
 * Purpose: Form for creating or editing a note.
 */
const NoteForm = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 className="page-title">{initialData ? 'Edit Note' : 'Create Note'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-input" 
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {initialData ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={onCancel} className="btn btn-outline" style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteForm;
