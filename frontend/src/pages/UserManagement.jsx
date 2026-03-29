import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Spinner } from 'react-bootstrap';
import api from '../api/axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        first_name: '',
        role: 'Employee',
        manager_id: '',
        email: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('auth/users/');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const username = newUser.first_name.toLowerCase().replace(" ", "") || newUser.email.split('@')[0];
            await api.post('auth/users/', {
                username: username,
                first_name: newUser.first_name,
                email: newUser.email,
                role: newUser.role,
                reporting_manager: newUser.manager_id || null
            });
            // Reset form
            setNewUser({ first_name: '', role: 'Employee', manager_id: '', email: '' });
            fetchUsers();
            alert('User successfully created! (Password dispatched via email)');
        } catch (err) {
            alert('Failed to create user. Ensure fields are correct.');
        }
    };

    const handleUpdateUser = async () => {
        try {
            await api.put(`auth/users/${editingId}/`, {
                first_name: editForm.first_name,
                role: editForm.role,
                reporting_manager: editForm.reporting_manager || null,
                email: editForm.email
            });
            setEditingId(null);
            fetchUsers();
        } catch (err) {
            alert('Failed to update user.');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to completely remove this user?")) return;
        try {
            await api.delete(`auth/users/${id}/`);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user.');
        }
    };

    const startEditing = (user) => {
        setEditingId(user.id);
        setEditForm({
            first_name: user.first_name || user.username,
            role: user.role,
            reporting_manager: user.reporting_manager || '',
            email: user.email
        });
    };
    
    // Get all possible managers
    const managers = users.filter(u => u.role === 'Manager' || u.role === 'Admin');

    return (
        <div>
            <div className="mb-4">
                <h2>Admin Hub (Company Users)</h2>
            </div>

            <Card className="border shadow-sm rounded-0 overflow-hidden" style={{ borderColor: '#e2e8f0', borderWidth: '1px' }}>
                <Table responsive bordered className="mb-0 align-middle" style={{ borderColor: '#e2e8f0' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                            <th className="py-3 px-3 text-center" style={{ width: '80px', color: '#64748b' }}>STATUS</th>
                            <th className="py-3 px-3" style={{ color: '#64748b' }}>USER NAME</th>
                            <th className="py-3 px-3" style={{ color: '#64748b' }}>ACCESS ROLE</th>
                            <th className="py-3 px-3" style={{ color: '#64748b' }}>REPORTS TO</th>
                            <th className="py-3 px-3" style={{ color: '#64748b' }}>EMAIL ADDRESS</th>
                            <th className="py-3 px-3 text-center" style={{ width: '150px', color: '#64748b' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* New User Row */}
                        <tr style={{ backgroundColor: '#f0fdfa' }}>
                            <td className="py-2 px-3 text-center fw-bold text-success">New</td>
                            <td className="py-2 px-3">
                                <Form.Control 
                                    size="sm"
                                    type="text" 
                                    placeholder="Name"
                                    value={newUser.first_name}
                                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                                    className="border-0 shadow-sm"
                                />
                            </td>
                            <td className="py-2 px-3">
                                <Form.Select 
                                    size="sm"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    className="border-0 shadow-sm"
                                >
                                    <option value="Employee">Employee</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </Form.Select>
                            </td>
                            <td className="py-2 px-3">
                                <Form.Select 
                                    size="sm"
                                    value={newUser.manager_id}
                                    onChange={(e) => setNewUser({...newUser, manager_id: e.target.value})}
                                    className="border-0 shadow-sm"
                                >
                                    <option value="">Select Manager...</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.id}>{m.first_name || m.username}</option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td className="py-2 px-3">
                                <Form.Control 
                                    size="sm"
                                    type="email" 
                                    placeholder="Company Email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="border-0 shadow-sm"
                                />
                            </td>
                            <td className="py-2 px-3 text-center">
                                <Button 
                                    variant="success" 
                                    size="sm" 
                                    className="fw-bold w-100 shadow-sm"
                                    onClick={handleCreateUser}
                                    disabled={!newUser.first_name || !newUser.email}
                                >
                                    + Add User
                                </Button>
                            </td>
                        </tr>

                        {/* Existing Users */}
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : (
                            users.map((u) => {
                                // Find manager name
                                const manager = users.find(m => m.id === u.reporting_manager);
                                const managerName = manager ? (manager.first_name || manager.username) : 'None';
                                const isEditing = editingId === u.id;
                                
                                return (
                                    <tr key={u.id}>
                                        <td className="py-3 px-3 text-center">
                                            <span className="badge bg-primary bg-opacity-10 text-primary">Active</span>
                                        </td>
                                        
                                        <td className="py-3 px-3 fw-bold">
                                            {isEditing ? (
                                                <Form.Control size="sm" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} />
                                            ) : (u.first_name || u.username)}
                                        </td>
                                        
                                        <td className="py-3 px-3">
                                            {isEditing ? (
                                                <Form.Select size="sm" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                                                    <option value="Employee">Employee</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Admin">Admin</option>
                                                </Form.Select>
                                            ) : (
                                                <span className={`badge ${u.role === 'Admin' ? 'bg-dark' : u.role === 'Manager' ? 'bg-info' : 'bg-secondary'}`}>
                                                    {u.role}
                                                </span>
                                            )}
                                        </td>
                                        
                                        <td className="py-3 px-3">
                                            {isEditing ? (
                                                <Form.Select size="sm" value={editForm.reporting_manager} onChange={e => setEditForm({...editForm, reporting_manager: e.target.value})}>
                                                    <option value="">None</option>
                                                    {managers.filter(m => m.id !== u.id).map(m => (
                                                        <option key={m.id} value={m.id}>{m.first_name || m.username}</option>
                                                    ))}
                                                </Form.Select>
                                            ) : managerName}
                                        </td>
                                        
                                        <td className="py-3 px-3">
                                            {isEditing ? (
                                                <Form.Control size="sm" type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                                            ) : u.email}
                                        </td>
                                        
                                        <td className="py-3 px-3 text-center">
                                            {isEditing ? (
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Button variant="primary" size="sm" onClick={handleUpdateUser}>Save</Button>
                                                    <Button variant="light" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Button variant="outline-dark" size="sm" onClick={() => startEditing(u)}>Details</Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u.id)}>Drop</Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default UserManagement;
