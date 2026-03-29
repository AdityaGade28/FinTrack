import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../api/axios';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('analytics/');
            setData(response.data);
        } catch (err) {
            console.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    const categoryLabels = data?.category_breakdown?.map(item => item.category) || [];
    const categoryValues = data?.category_breakdown?.map(item => item.total) || [];

    const pieData = {
        labels: categoryLabels,
        datasets: [{
            data: categoryValues,
            backgroundColor: ['#1a2332', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 0,
        }]
    };

    const barData = {
        labels: data?.user_totals?.map(item => item.user__username) || [],
        datasets: [{
            label: 'Total Spend (₹)',
            data: data?.user_totals?.map(item => item.total) || [],
            backgroundColor: '#3b82f6',
            borderRadius: 8,
        }]
    };

    return (
        <div>
            <div className="mb-4">
                <h2>Spending Analytics</h2>
                <p className="text-secondary">Visual insights into company expenditure</p>
            </div>

            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="p-4 border-0 shadow-sm rounded-4 bg-white h-100">
                        <h5 className="fw-bold mb-4">Category Breakdown</h5>
                        <div style={{ maxHeight: '300px' }} className="d-flex justify-content-center">
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-4 border-0 shadow-sm rounded-4 bg-white h-100">
                        <h5 className="fw-bold mb-4">Top Spending Users</h5>
                        <div style={{ maxHeight: '300px' }}>
                            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={12}>
                    <Card className="p-4 border-0 shadow-sm rounded-4 bg-white">
                        <h5 className="fw-bold mb-0">Total Monitored Spend: ₹{data?.total_expenses.toLocaleString()}</h5>
                        <small className="text-secondary">Including ₹{data?.total_pending.toLocaleString()} pending approvals</small>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analytics;
