import { isAdmin } from '../utils/roles';

/**
 * Purpose: Displays a single note.
 * Flow: Shows actions (edit/delete) only if the user owns the note or is an admin.
 */
const NoteCard = ({ note, onEdit, onDelete, currentUser }) => {
    const isOwner = note.owner?._id === currentUser?._id;
    const canManage = isOwner || isAdmin(currentUser);

    return (
        <div className="card note-card">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-description">{note.description}</p>
            
            <div className="note-meta">
                <span>By: {note.owner?.name || 'Unknown'}</span>
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>

            {canManage && (
                <div className="note-actions">
                    <button onClick={() => onEdit(note)} className="btn btn-outline btn-sm">Edit</button>
                    <button onClick={() => onDelete(note._id)} className="btn btn-danger btn-sm">Delete</button>
                </div>
            )}
        </div>
    );
};

export default NoteCard;
