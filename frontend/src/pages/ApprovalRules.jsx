import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Row, Col, Button, InputGroup, Alert } from 'react-bootstrap';
import { Trash2, PlusCircle, Save } from 'lucide-react';
import api from '../api/axios';

const ApprovalRules = () => {
    const [users, setUsers] = useState([]);
    
    const [selectedUser, setSelectedUser] = useState('');
    const [manager, setManager] = useState('');
    const [description, setDescription] = useState('Approval rule for miscellaneous expenses');
    
    const [isManagerApprover, setIsManagerApprover] = useState(false);
    const [approvers, setApprovers] = useState([]);
    const [newApproverId, setNewApproverId] = useState('');
    
    const [isSequence, setIsSequence] = useState(false);
    const [percentage, setPercentage] = useState('100');
    
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('auth/users/');
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to load users for rules.");
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        const userObj = users.find(u => u.id.toString() === userId);
        if (userObj && userObj.reporting_manager) {
            setManager(userObj.reporting_manager.toString());
        } else {
            setManager('');
        }
    };

    const addApprover = () => {
        if (!newApproverId) return;
        if (approvers.find(a => a.user_id === newApproverId)) return;
        
        const userObj = users.find(u => u.id.toString() === newApproverId);
        setApprovers([...approvers, { 
            id: Date.now().toString(), 
            user_id: newApproverId, 
            name: userObj ? (userObj.first_name || userObj.username) : 'Unknown', 
            required: false 
        }]);
        setNewApproverId('');
    };

    const removeApprover = (id) => {
        setApprovers(approvers.filter(a => a.id !== id));
    };

    const toggleRequired = (id) => {
        setApprovers(approvers.map(a => a.id === id ? { ...a, required: !a.required } : a));
    };

    const handleSaveRule = async () => {
        try {
            setMessage('');
            const payload = {
                description: description,
                target_user: selectedUser || null,
                manager: manager || null,
                is_manager_approver: isManagerApprover,
                approvers_sequence: isSequence,
                min_approval_percentage: parseInt(percentage) || 100,
                approvers: approvers.map((a, idx) => ({
                    user: parseInt(a.user_id),
                    required: a.required,
                    sequence_order: idx + 1
                }))
            };
            
            await api.post('approvals/rules/', payload);
            setMessage('Rule saved successfully!');
            // Reset for visual feedback
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Failed to save rule. Check console.');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Advanced Rule Builder</h2>
                <Button variant="primary" onClick={handleSaveRule} className="fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4" style={{ backgroundColor: '#10b981', border: 'none' }}>
                    <Save size={18} /> Save Complete Rule
                </Button>
            </div>
            
            {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}

            <Card className="p-4 border-0 rounded-4 shadow-sm bg-white mb-4">
                <Row className="mb-4 align-items-end">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-secondary small text-uppercase">Target Rule Scope (Leave blank for Company-Wide)</Form.Label>
                            <Form.Select 
                                value={selectedUser} 
                                onChange={handleUserChange}
                                className="shadow-none border-dark border-opacity-25"
                                style={{ borderRadius: '10px' }}
                            >
                                <option value="">Global Company Rule</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.first_name || u.username}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="fw-bold text-secondary small text-uppercase">Rule Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                className="shadow-none border-dark border-opacity-25"
                                style={{ borderRadius: '10px' }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Card>

            <Card className="p-4 border-0 rounded-4 shadow-sm bg-white">
                <Row>
                    <Col md={4} className="border-end pe-4">
                        <h5 className="fw-bold mb-4">Initial Hierarchical Checks</h5>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-secondary small text-uppercase">Line Manager Delegation</Form.Label>
                            <Form.Select 
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                                className="shadow-none border-dark border-opacity-25 mb-2"
                                style={{ borderRadius: '10px' }}
                            >
                                <option value="">No specific manager assigned...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.first_name || u.username}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        
                        <div className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <Form.Check 
                                type="checkbox" 
                                id="is-manager" 
                                checked={isManagerApprover}
                                onChange={(e) => setIsManagerApprover(e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <div>
                                <h6 className="fw-bold text-primary mb-1" style={{ marginTop: '-2px' }}>Route to Manager First?</h6>
                                <p className="text-secondary small mb-0 lh-sm">If checked, the exact specific reporting manager must approve this before the custom rule queue begins.</p>
                            </div>
                        </div>
                    </Col>
                    
                    <Col md={8} className="ps-4">
                        <h5 className="fw-bold mb-4">Custom Configuration Queue</h5>
                        
                        <div className="mb-4 border border-dark border-opacity-25 rounded-4 p-3 overflow-hidden">
                            <Table responsive borderless className="mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th className="fw-bold text-secondary small text-uppercase">Sequence</th>
                                        <th className="fw-bold text-secondary small text-uppercase">Approving Authority</th>
                                        <th className="fw-bold text-secondary small text-uppercase text-center">Required (Override)</th>
                                        <th className="text-end"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvers.map((appr, index) => (
                                        <tr key={appr.id} className="border-bottom border-dark border-opacity-10">
                                            <td className="fw-bold text-secondary">Step {index + 1}</td>
                                            <td className="fw-bold text-dark">{appr.name}</td>
                                            <td className="text-center">
                                                <Form.Check 
                                                    type="checkbox" 
                                                    checked={appr.required}
                                                    onChange={() => toggleRequired(appr.id)}
                                                    style={{ transform: 'scale(1.3)' }}
                                                    className="d-inline-block"
                                                />
                                            </td>
                                            <td className="text-end">
                                                <Button variant="light" size="sm" onClick={() => removeApprover(appr.id)} className="text-danger rounded-circle p-2">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {approvers.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-4 text-secondary fst-italic">No custom delegates in queue yet.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                            
                            <div className="d-flex gap-2 mt-3 p-3 bg-light rounded-3">
                                <Form.Select 
                                    value={newApproverId}
                                    onChange={(e) => setNewApproverId(e.target.value)}
                                    className="shadow-none border-0"
                                >
                                    <option value="">Select a user to grant authority...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.first_name || u.username}</option>
                                    ))}
                                </Form.Select>
                                <Button variant="dark" onClick={addApprover} className="d-flex align-items-center gap-2 px-4 fw-bold flex-shrink-0">
                                    <PlusCircle size={16} /> Add Authority
                                </Button>
                            </div>
                        </div>

                        <Row className="g-4">
                            <Col md={6}>
                                <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100" style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                    <Form.Check 
                                        type="checkbox" 
                                        checked={isSequence}
                                        onChange={(e) => setIsSequence(e.target.checked)}
                                        style={{ transform: 'scale(1.2)' }}
                                    />
                                    <div>
                                        <h6 className="fw-bold text-warning mb-1" style={{ marginTop: '-2px' }}>Sequential Processing?</h6>
                                        <p className="text-secondary small mb-0 lh-sm">If checked, delegates must approve strictly one after the other. If unchecked, requests deploy to everyone in parallel simultaneously.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="p-3 rounded-3 h-100" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h6 className="fw-bold text-success mb-2">Completion Threshold</h6>
                                    <div className="d-flex align-items-center gap-2">
                                        <InputGroup className="w-50">
                                            <Form.Control 
                                                type="number" 
                                                value={percentage}
                                                onChange={(e) => setPercentage(e.target.value)}
                                                className="shadow-none border-success border-opacity-25 fw-bold"
                                                disabled={isSequence}
                                            />
                                            <InputGroup.Text className="bg-white border-success border-opacity-25 fw-bold text-success">%</InputGroup.Text>
                                        </InputGroup>
                                        <small className="text-secondary lh-sm" style={{ fontSize: '0.7em' }}>Needed to pass Parallel flows.</small>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ApprovalRules;
