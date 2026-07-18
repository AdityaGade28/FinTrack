
# FinTrack — Smart Expense & Reimbursement Management System

FinTrack is a premium enterprise-grade expense management and reimbursement system. It enables employees to scan receipts using OCR, submit expenses, track reimbursement cycles, and allows managers and administrators to configure custom multi-stage approval workflows, view team analytics, and manage users.

---

## 🚀 Key Features

* **AI-Powered OCR Receipt Scanner**: Extract vendor name, transaction date, and total amount from uploaded receipts (JPEG, PNG, BMP, or PDF) using Tesseract OCR and OpenCV.
* **Flexible Approval Workflow Engine**: 
  * Support for sequential or parallel approval paths.
  * Role-based routing (Employee ➔ Direct Manager ➔ Admin).
  * Custom approval thresholds (e.g., minimum 60% approval rate, mandatory CFO sign-off overrides).
* **Role-Based Access Control (RBAC)**: Secure access tailored to **Employees**, **Managers**, and **Admins**.
* **Real-time Scoped Analytics**: Interactive dashboards with category breakdowns, monthly trends, and department aggregates.
* **Robust Authentication**: Dual-identifier login (Email or Username) backed by secure JWT token lifecycles.
* **Audit Trail & Logging**: Complete transparency with automated logging of all actions, rejections, and comments.

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
|---|---|---|
| **Frontend** | React 19, Vite, Bootstrap 5, Chart.js, Axios | Fast, modern single-page application with responsive CSS dashboard layouts |
| **Backend** | Django 6.0, Django REST Framework | Clean, MVC-patterned REST API backend |
| **Database** | MySQL | Robust relational database |
| **Auth** | SimpleJWT | Token-based security and authorization |
| **OCR/Image** | Tesseract OCR, OpenCV, PyMuPDF, Pillow | Multi-format OCR receipt scanner pipeline |

---

## 📂 Project Structure

```text
FinTrack/
├── backend/            # Django REST API Backend
│   ├── accounts/       # User profiles, companies, reporting hierarchy
│   ├── analytics/      # Financial aggregation endpoints
│   ├── approvals/      # Workflow rules and sequence engines
│   ├── backend/        # Global Django settings and URLs
│   ├── expenses/       # Expense submission, storage, and OCR scanning
│   ├── manage.py
│   └── requirements.txt
├── frontend/           # React + Vite Single Page Application
│   ├── src/
│   │   ├── api/        # Axios client instance
│   │   ├── components/ # Reusable UI components (Navbar, Sidebar, etc.)
│   │   ├── pages/      # Dashboards, login/register, expense forms
│   │   ├── App.jsx     # Route configurations
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md           # Project Documentation
└── .gitignore          # Repository git ignore rules
```

---

## 🔧 Installation & Setup

### Prerequisites

* Python 3.10+
* Node.js 18+
* MySQL 8.0+
* **Tesseract-OCR** installed on the host machine.
  * *Windows default path*: `C:\Program Files\Tesseract-OCR\tesseract.exe`
  * Make sure to add Tesseract to your System Environment variables.

---

### 1. Database Setup

1. Open your MySQL client and create the database:
   ```sql
   CREATE DATABASE fintrack_db;
   ```
2. Verify database settings in [backend/backend/settings.py](file:///c:/Users/HP/OneDrive/Desktop/FinTrack/backend/backend/settings.py):
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'fintrack_db',
           'USER': 'root',
           'PASSWORD': 'YOUR_PASSWORD',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

---

### 2. Backend Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the database migrations:
   ```bash
   python manage.py makemigrations accounts expenses approvals analytics
   python manage.py migrate
   ```
5. Create a superuser/admin account:
   ```bash
   python manage.py createsuperuser
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```
   *The backend REST API will run at `http://127.0.0.1:8000/`.*

---

### 3. Frontend Installation

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend SPA will run at `http://localhost:5173/`.*

---

## 🔒 Default Role Workflow & Scopes

* **Admin Dashboard**: Access to all expenses, user management, and configuration of custom company-wide approval rules.
* **Manager Dashboard**: Action assigned approval flows, view team expense reports, and submit personal expenses.
* **Employee Dashboard**: Upload receipts, view personal reimbursement status (Draft, Pending, Approved, Rejected).

---

## 📄 License

This project is licensed under the MIT License.
=======
# FinTrack
FinTrack is an AI-powered personal finance management platform designed to help users track income, expenses, budgets, savings, and financial goals. The platform combines intelligent financial insights, interactive dashboards, secure authentication, and data visualization to simplify money management and support smarter financial decision-making.
>>>>>>> 954d6e5d949b8d058dc34c151b04a103b3919b4f
