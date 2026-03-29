import { Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({ pendingTotal: 0, approvedTotal: 0, overall: 0 });
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyData();
    }, []);

    const fetchMyData = async () => {
        try {
            const res = await api.get('expenses/');
            let myExpenses = res.data;
            
            // Auto-seed if system appears empty (Raw Indian Data requirement)
            if (myExpenses.length === 0) {
                await api.get('auth/initialize-enterprise-data/');
                const retryRes = await api.get('expenses/');
                myExpenses = retryRes.data;
            }
            
            setStats({
                pendingTotal: myExpenses.filter(e => e.status === 'Pending' || e.status === 'Draft').reduce((acc, curr) => acc + parseFloat(curr.amount), 0),
                approvedTotal: myExpenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + parseFloat(curr.amount), 0),
                overall: myExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
            });
            
            setExpenses(myExpenses.slice(0, 8));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        const currency = user?.company?.base_currency || 'INR';
        const locale = currency === 'INR' ? 'en-IN' : 'en-US';
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
    };

    const lineData = {
        labels: ['W1', 'W2', 'W3', 'W4'],
        datasets: [{
            label: 'Reimbursements',
            data: [stats.overall * 0.2, stats.overall * 0.35, stats.overall * 0.15, stats.overall * 0.3],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0 fw-bold">My Personal Portal</h2>
                    <p className="text-secondary small mb-0">Track and submit your business expense reimbursements</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-success" size="sm" className="rounded-pill px-3 fw-bold" onClick={async () => {
                        await api.get('auth/initialize-enterprise-data/');
                        fetchMyData();
                    }}>
                        Refresh My Records
                    </Button>
                    <Button 
                        className="fw-bold d-flex align-items-center gap-2 shadow-sm rounded-pill px-4 text-white"
                        style={{ backgroundColor: '#10b981', border: 'none' }}
                        onClick={() => navigate('/expenses/new')}
                    >
                        <PlusCircle size={18} />
                        <span>Submit Expense</span>
                    </Button>
                </div>
            </div>
            
            <Row className="g-4 mb-4">
                <Col md={8}>
                    <Card className="p-4 border-0 shadow-sm rounded-4 bg-white h-100">
                        <h6 className="fw-bold text-dark mb-4">Monthly Spending Trend</h6>
                        <div style={{ height: '220px' }}>
                            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <div className="d-flex flex-column gap-3 h-100">
                        <Card className="p-4 bg-white border-0 shadow-sm rounded-4 flex-grow-1">
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                    <Clock size={24} className="text-warning" />
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold">{formatCurrency(stats.pendingTotal)}</h3>
                                    <small className="text-secondary fw-bold text-uppercase" style={{fontSize: '0.7em'}}>Pending Approval</small>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 bg-white border-0 shadow-sm rounded-4 flex-grow-1">
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                    <CheckCircle size={24} className="text-success" />
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold text-success">{formatCurrency(stats.approvedTotal)}</h3>
                                    <small className="text-secondary fw-bold text-uppercase" style={{fontSize: '0.7em'}}>Reimbursed Today</small>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>

            <h5 className="fw-bolder mb-3 text-dark">Recent Submissions</h5>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Table responsive hover className="mb-0 align-middle">
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                            <th className="py-3 px-4 fw-bold text-secondary small">DATE</th>
                            <th className="py-3 fw-bold text-secondary small">CATEGORY</th>
                            <th className="py-3 fw-bold text-secondary small">DESCRIPTION</th>
                            <th className="py-3 fw-bold text-secondary small">AMOUNT</th>
                            <th className="py-3 fw-bold text-secondary small">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                        ) : expenses.length > 0 ? (
                            expenses.map(exp => (
                                <tr key={exp.id}>
                                    <td className="py-3 px-4 fw-bold text-secondary">{new Date(exp.date || exp.created_at).toLocaleDateString()}</td>
                                    <td className="py-3"><span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-2 rounded-pill">{exp.category}</span></td>
                                    <td className="py-3 text-dark">{exp.description}</td>
                                    <td className="py-3 fw-bolder text-dark">{formatCurrency(exp.amount)}</td>
                                    <td className="py-3">
                                        <span className={`badge px-3 py-2 rounded-pill ${
                                            exp.status === 'Approved' ? 'bg-success bg-opacity-10 text-success' : 
                                            exp.status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' : 
                                            'bg-warning bg-opacity-10 text-warning'
                                        }`}>
                                            {exp.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-4 text-secondary">No expenses submitted yet.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default EmployeeDashboard;
