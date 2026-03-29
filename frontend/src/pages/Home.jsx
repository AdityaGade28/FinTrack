import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ShieldCheck, Zap, Globe, Users, CheckCircle, BarChart3, Clock, Lock } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white min-vh-100 position-relative" style={{ overflowX: 'hidden' }}>
            {/* Top Navigation */}
            {/* Top Navigation */}
            <nav className="navbar navbar-expand-lg sticky-top px-4 py-3 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                <div className="container">
                    <Link to="/" className="navbar-brand py-0">
                        <img src="/logo-light.png" alt="FinTrack" style={{ height: '35px' }} />
                    </Link>
                    <div className="d-flex gap-3 ms-auto align-items-center">
                        <a href="#features" className="text-secondary text-decoration-none d-none d-md-block fw-bold mx-2">Features</a>
                        <a href="#how-it-works" className="text-secondary text-decoration-none d-none d-md-block fw-bold mx-2">Workflow</a>
                        <Link to="/login" className="btn btn-outline-dark px-4 rounded-pill fw-bold" style={{ borderColor: 'rgba(0,0,0,0.2)' }}>Login</Link>
                        <Link to="/register" className="btn text-white px-4 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: '#10b981', border: 'none' }}>Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="py-5 text-white position-relative overflow-hidden" style={{ backgroundColor: '#020617', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="position-absolute top-0 end-0 w-75 h-100" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(2,6,23,0) 70%)', transform: 'translate(10%, -20%)' }}></div>
                <div className="position-absolute bottom-0 start-0 w-50 h-100" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(2,6,23,0) 70%)', transform: 'translate(-30%, 30%)' }}></div>
                
                <Container className="position-relative z-index-1">
                    <Row className="align-items-center justify-content-between g-5">
                        <Col lg={6} className="text-center text-lg-start">
                            <div className="badge border px-3 py-2 rounded-pill fw-bold mb-4" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)', backgroundColor: 'rgba(16,185,129,0.05)' }}>
                                <span className="me-2 text-white px-2 py-1 rounded-pill small" style={{ backgroundColor: '#10b981' }}>NEW</span> Multi-Currency & OCR Version 2.0
                            </div>
                            <h1 className="display-4 fw-black mb-4" style={{ fontWeight: '900', letterSpacing: '-1.5px', lineHeight: '1.05' }}>
                                India's #1 <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Expense & Approvals</span> Cloud
                            </h1>
                            <p className="lead mb-5 pe-lg-4 fs-5" style={{ color: '#cbd5e1' }}>
                                Empower your Indian enterprise with FinTrack. Automated receipt scanning (OCR), complex multi-level approval logic, and local currency (INR) reimbursement tracking—all in one secure, role-aware platform.
                            </p>
                            <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                                <Link to="/register" className="btn btn-lg rounded-pill fw-bold px-5 py-3 shadow border-0 text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    Start for Free
                                </Link>
                                <a href="#features" className="btn btn-outline-light btn-lg rounded-pill fw-bold px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                                    Explore Product
                                </a>
                            </div>
                        </Col>
                        
                        <Col lg={5} className="d-none d-lg-block">
                            <div className="p-2 rounded-4 shadow-lg position-relative" style={{ background: 'linear-gradient(to bottom right, #0f172a, #020617)', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Dashboard Preview" className="img-fluid rounded-3 opacity-75 hover-opacity-100 transition-all" style={{ objectFit: 'cover', height: '400px', width: '100%' }} />
                                {/* Floating overlay card */}
                                <div className="position-absolute bg-white text-dark py-3 px-4 rounded-4 shadow-lg" style={{ bottom: '-30px', left: '-40px', border: '1px solid rgba(0,0,0,0.1)' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}>
                                            <CheckCircle size={28} style={{ color: '#10b981' }} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bolder mb-0">Receipt Auto-Scanned</h6>
                                            <small className="text-secondary fw-bold">Amount: ₹4,567.00 • Food</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="position-absolute bg-white text-dark py-3 px-4 rounded-4 shadow-lg" style={{ top: '40px', right: '-30px', border: '1px solid rgba(0,0,0,0.1)' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}>
                                            <CheckCircle size={28} style={{ color: '#3b82f6' }} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bolder mb-0">Finance Approved</h6>
                                            <small className="text-secondary fw-bold">Just now by Sarah</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* Core Features */}
            <section id="features" className="py-5 bg-white">
                <Container className="py-5">
                    <div className="text-center mb-5 pb-4">
                        <span className="fw-bolder tracking-widest text-uppercase small" style={{ color: '#10b981' }}>Enterprise Capabilities</span>
                        <h2 className="display-6 fw-black mt-2 mb-3" style={{ color: '#0f172a' }}>Built for scale. Designed for humans.</h2>
                        <p className="text-secondary mx-auto fs-5" style={{ maxWidth: '700px' }}>
                            We eliminated the friction of manual expense reporting. FinTrack integrates AI receipt tracking and an intelligent routing engine into one sleek dashboard.
                        </p>
                    </div>
                    
                    <Row className="g-4">
                        <Col lg={4} md={6}>
                            <Card className="h-100 border-0 shadow-sm p-4 rounded-4" style={{ background: '#f8fafc', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="mb-4 d-inline-block rounded p-3" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }}>
                                    <Zap size={32} />
                                </div>
                                <h4 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>AI Receipt OCR</h4>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>Upload a picture of a receipt and our Tesseract-driven AI extracts the vendor, amount, and date instantly. No manual typing required.</p>
                            </Card>
                        </Col>
                        <Col lg={4} md={6}>
                            <Card className="h-100 border-0 shadow-sm p-4 rounded-4" style={{ background: '#f8fafc', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="mb-4 d-inline-block rounded p-3" style={{ color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' }}>
                                    <ShieldCheck size={32} />
                                </div>
                                <h4 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>Sequential Approving</h4>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>Construct parallel or sequential approval routing paths based on categories or logic thresholds. If one rejects, it handles the logic cleanly.</p>
                            </Card>
                        </Col>
                        <Col lg={4} md={6}>
                            <Card className="h-100 border-0 shadow-sm p-4 rounded-4" style={{ background: '#f8fafc', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="mb-4 d-inline-block rounded p-3" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }}>
                                    <Globe size={32} />
                                </div>
                                <h4 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>Global Base Currency</h4>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>Employees input their expenses in local currencies while the management sees the converted baseline tracking using real-time syncs.</p>
                            </Card>
                        </Col>
                        <Col lg={4} md={6}>
                            <Card className="h-100 border-0 shadow-sm p-4 rounded-4" style={{ background: '#f8fafc', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="mb-4 d-inline-block rounded p-3" style={{ color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' }}>
                                    <Users size={32} />
                                </div>
                                <h4 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>RBAC Segregation</h4>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>Strict isolation built-in between Admin control, Manager overviews, and Employee expense submission endpoints.</p>
                            </Card>
                        </Col>
                        <Col lg={4} md={6}>
                            <Card className="h-100 border-0 shadow-sm p-4 rounded-4" style={{ background: '#f8fafc', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="mb-4 d-inline-block rounded p-3" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }}>
                                    <BarChart3 size={32} />
                                </div>
                                <h4 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>Macro Analytics</h4>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>Live charting overviews utilizing Chart.js to dissect spending trends and single out categories taking your budget.</p>
                            </Card>
                        </Col>
                        <Col lg={4} md={6}>
                            <Card className="h-100 border-0 shadow-sm p-4 rounded-4" style={{ background: '#f8fafc', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="mb-4 d-inline-block rounded p-3" style={{ color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' }}>
                                    <Lock size={32} />
                                </div>
                                <h4 className="fw-bolder mb-3" style={{ color: '#0f172a' }}>Immutable Audit Trail</h4>
                                <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>Every approval, rejection, and submission writes to an immutable Audit Log, making compliance a breeze.</p>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* How It Works Layer */}
            <section id="how-it-works" className="py-5" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <Container className="py-5">
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0 pe-lg-5">
                            <span className="fw-bolder tracking-widest text-uppercase small" style={{ color: '#3b82f6' }}>The Workflow</span>
                            <h2 className="display-5 fw-black mt-2 mb-4" style={{ color: '#0f172a' }}>From receipt to reimbursement in record time.</h2>
                            
                            <div className="d-flex mb-4">
                                <div className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mt-1 shadow-sm" style={{ backgroundColor: '#10b981', width: '40px', height: '40px', minWidth: '40px' }}>1</div>
                                <div className="ms-4">
                                    <h4 className="fw-bold mb-2">Snap & Upload</h4>
                                    <p className="text-secondary">Employees take a picture and our OCR fills out the total. They assign a Category, Description, and press Submit.</p>
                                </div>
                            </div>
                            <div className="d-flex mb-4">
                                <div className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mt-1 shadow-sm" style={{ backgroundColor: '#3b82f6', width: '40px', height: '40px', minWidth: '40px' }}>2</div>
                                <div className="ms-4">
                                    <h4 className="fw-bold mb-2">Logical Routing</h4>
                                    <p className="text-secondary">The system checks Admin rules (Percentage Minimums, Over-Amount sequences) and assigns to Managers.</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mt-1 shadow-sm" style={{ backgroundColor: '#0f172a', width: '40px', height: '40px', minWidth: '40px' }}>3</div>
                                <div className="ms-4">
                                    <h4 className="fw-bold mb-2">Instant Review & Log</h4>
                                    <p className="text-secondary">Approvers hit "Approve" via their fast-action dashboard, the log seals the transaction.</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="p-4 rounded-4 position-relative border bg-white shadow-md">
                                <div className="bg-white rounded shadow-sm border p-4">
                                    <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
                                        <div className="fw-bolder">Expense <span style={{ color: '#3b82f6' }}>#EX-9041</span></div>
                                        <div className="badge bg-warning text-dark px-3 mt-1">Pending</div>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-secondary fw-bold small text-uppercase">Vendor</span>
                                        <span className="fw-bold">Client Dinner (Hyatt)</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-secondary fw-bold small text-uppercase">Total Amount</span>
                                        <span className="fw-bold text-danger">₹12,567.00 INR</span>
                                    </div>
                                    <div className="mt-4 pt-3 border-top">
                                        <Button className="w-100 fw-bold py-2 mb-2 rounded-3 text-white border-0 shadow-sm" style={{ backgroundColor: '#10b981' }}>Approve Expense</Button>
                                        <Button variant="outline-danger" className="w-100 fw-bold py-2 rounded-3 text-danger">Reject</Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Testimonial CTA Section */}
            <section className="py-5 text-center position-relative" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="mb-4">
                                <span className="text-warning fs-4">★★★★★</span>
                            </div>
                            <h3 className="fw-light fst-italic mb-4 lh-base" style={{ color: '#e2e8f0' }}>"FinTrack has totally overhauled how we treat expenses. Moving from confusing spreadsheets to a central app with sequence checking saved us endless hours."</h3>
                            <h6 className="fw-bold mb-0 text-white">Jane Doe, CFO at TechPinnacle</h6>
                            
                            <hr className="my-5 border-secondary" style={{ opacity: 0.2 }} />
                            
                            <h2 className="display-6 fw-black mb-4">Ready to automate your finances?</h2>
                            <Link to="/register" className="btn btn-lg rounded-pill fw-bold px-5 py-3 shadow border-0 mx-2 text-white" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                                Register Your Company
                            </Link>
                            <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill fw-bold px-5 py-3 mx-2 mt-3 mt-sm-0" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}>
                                Sign In
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Structured Footer */}
            <footer className="py-5 bg-white border-top">
                <Container>
                    <Row className="g-4 mb-4">
                        <Col lg={4}>
                            <div className="mb-3">
                                <img src="/logo-light.png" alt="FinTrack" style={{ height: '35px' }} />
                            </div>
                            <p className="text-secondary small pe-lg-5">The premier open-source focused platform for enterprise-grade expense management and logical sequential authorizations.</p>
                        </Col>
                        <Col lg={2} xs={6}>
                            <h6 className="fw-bold mb-3">Product</h6>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                <li><a href="#" className="text-secondary text-decoration-none small">Features</a></li>
                                <li><a href="#" className="text-secondary text-decoration-none small">Integrations</a></li>
                                <li><a href="#" className="text-secondary text-decoration-none small">Pricing</a></li>
                            </ul>
                        </Col>
                        <Col lg={2} xs={6}>
                            <h6 className="fw-bold mb-3">Resources</h6>
                            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                <li><a href="#" className="text-secondary text-decoration-none small">Documentation</a></li>
                                <li><a href="#" className="text-secondary text-decoration-none small">Guides</a></li>
                                <li><a href="#" className="text-secondary text-decoration-none small">API Status</a></li>
                            </ul>
                        </Col>
                        <Col lg={4}>
                            <h6 className="fw-bold mb-3">Stay Updated</h6>
                            <div className="d-flex gap-2">
                                <input type="email" className="form-control rounded shadow-sm" placeholder="Enter your email" />
                                <Button className="rounded fw-bold px-3 text-white border-0" style={{ backgroundColor: '#0f172a' }}>Subscribe</Button>
                            </div>
                        </Col>
                    </Row>
                    <div className="text-center pt-4 border-top">
                        <p className="text-secondary small mb-0">© {new Date().getFullYear()} FinTrack Systems Inc. All rights reserved.</p>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default Home;
