import { ROLES } from '../utils/roles';

/**
 * Purpose: Displays a table of users for the admin panel.
 */
const UserTable = ({ users, onDelete, onRoleChange, currentUser }) => {
    return (
        <div className="table-container card">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        const isSelf = user._id === currentUser?._id;
                        return (
                            <tr key={user._id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td className="text-secondary">{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === ROLES.ADMIN ? 'badge-admin' : 'badge-user'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select 
                                            className="form-input" 
                                            style={{ padding: '0.25rem', width: 'auto' }}
                                            value={user.role}
                                            onChange={(e) => onRoleChange(user._id, e.target.value)}
                                            disabled={isSelf}
                                        >
                                            <option value={ROLES.USER}>User</option>
                                            <option value={ROLES.ADMIN}>Admin</option>
                                        </select>
                                        
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDelete(user._id)}
                                            disabled={isSelf}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
