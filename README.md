# 💰 THE LEDGER Finance Dashboard

A modern, responsive finance dashboard built to track income, expenses, and financial insights with a clean, premium user experience.

This project was developed as part of a frontend assessment, with a strong focus on **real-world product thinking, UI/UX quality, and scalable architecture** — not just basic functionality.

---

## Github Repo 
 https://github.com/PrasanthVerma/THE-LEDGER-Finance-Dashboard

## 🚀 Live Demo

👉 https://your-project.vercel.app

---

## ✨ Features

* 📊 **Interactive Dashboard**

  * Real-time balance, income, and expense tracking
  * Clean summary cards with trend indicators

* 📈 **Data Visualization**

  * Bar chart → Income vs Expenses
  * Line chart → Financial trends
  * Pie chart → Expense distribution
  * Built using Recharts

* 💳 **Transaction Management**

  * Add new transactions via modal
  * Filter by category
  * Sort by date and amount
  * Dynamic updates across the app

* 📉 **Insights & Analytics**

  * Highest spending category
  * Monthly savings insights
  * Financial trends overview

* 👥 **Role-Based Access**

  * **User** → View & add transactions
  * **Admin** → Edit & delete transactions + manage data

* 🌗 **Dark / Light Mode**

  * Seamless theme switching
  * Consistent UI across themes

* ⚡ **Smooth Animations**

  * Subtle transitions using Framer Motion
  * Enhanced interaction feedback

* 📱 **Fully Responsive**

  * Optimized for desktop, tablet, and mobile

---

## 🛠 Tech Stack

* **React (Vite)** — Fast and modern frontend setup
* **Tailwind CSS** — Utility-first styling for consistent design
* **Recharts** — Data visualization
* **Framer Motion** — Smooth animations and transitions
* **Context API** — State management

---

## 🧠 Architecture & Approach

This project was built with a **scalable and maintainable structure** in mind:

* Centralized state management using **Context API**
* Separation of concerns between:

  * UI components
  * Business logic
  * Data handling
* Derived state for:

  * Total balance
  * Income and expense calculations
  * Category-based insights
* Modular component structure for reusability

The goal was to simulate a **real SaaS dashboard architecture**, not just a static UI.

---

## 📸 Screenshots



* Dashboard view
[dashboard](./public/screenshots/Dashboard.png)
* Transactions page
[Transactions](./public/screenshots/Transactions.png)
* Analytics page
[Analytics](./public/screenshots/Analytics.png)


---

## 📁 Project Structure

src/
├── components/
│    ├── dashboard/        # Dashboard cards, charts, summaries
│    ├── insights/         # Insights UI components
│    ├── layout/           # Sidebar, Navbar, layout wrappers
│    └── transactions/     # Transaction table, modal, filters
│
├── context/
│    ├── FinanceContext.jsx   # Global finance state (transactions, totals)
│    ├── RoleContext.jsx      # Role-based access (Admin/User)
│    └── ThemeContext.jsx     # Dark/Light mode handling
│
├── data/
│    └── dummyData.js      # Initial mock data
│
├── pages/
│    ├── Dashboard.jsx     # Main dashboard view
│    ├── Transactions.jsx  # Transaction management page
│    ├── Insights.jsx      # Financial insights & analytics
│    ├── Analytics.jsx     # Extended analytics (charts & trends)
│    ├── Assets.jsx        # Asset overview (optional feature)
│    └── Settings.jsx      # Theme & role settings
│
├── utils/
│    └── calculations.js   # Helper functions for financial logic
│
├── App.jsx                # App routing & layout
├── main.jsx               # Entry point
└── index.css              # Global styles



---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

---

## 🔑 Demo Roles

* **User**

  * Add transactions
  * View dashboard & insights

* **Admin**

  * Edit & delete transactions
  * Full data control

---

## 🎯 Key Highlights

* Designed to feel like a **real fintech SaaS product**
* Focus on **UI/UX quality and usability**
* Clean and scalable codebase
* Proper state management using Context API
* Production-ready frontend structure

---

## 🧠 Challenges & Learnings

* Designing a consistent UI system across dark and light themes
* Structuring global state without overcomplicating (Context vs Redux)
* Managing derived financial data efficiently
* Building reusable components while maintaining design consistency
* Learning about the Recharts library and learing about the proper usage of it

---

## 🔮 Future Improvements

* Backend integration (Node.js + database)
* Authentication & user accounts
* Real-time data updates
* Advanced analytics

---

## 👨‍💻 Author

**Prasanth Kumar Verma**

Frontend Developer | Building modern, scalable web experiences

* LinkedIn: https://www.linkedin.com/in/prasanth-kumar-verma-009994356
* Portfolio: https://prasanth-portfolio-theta.vercel.app/

---

## 📌 Note

This project focuses on **frontend architecture, user experience, and product-level thinking**, simulating a real-world dashboard application.
