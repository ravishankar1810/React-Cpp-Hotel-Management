# 🏨 PiyuNima Hotel Management System

### A Full-Stack Luxury Hospitality Platform
**Built by Ravi Shankar**

![Status](https://img.shields.io/badge/Status-Completed-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20C%2B%2B%20%7C%20Vite-blue)

## 📖 Overview
PiyuNima Hotel is an industry-level hospitality management application designed to demonstrate the integration of a high-performance **C++ Backend** with a modern, luxury-styled **React Frontend**.

The project features a custom-built TCP server for handling API requests, role-based authentication, and a file-based persistence system to ensure data integrity across sessions.

## ✨ Key Features

### 🖥️ Frontend (React + Vite)
* **Luxury UI/UX:** Implements a "Dark Gold" theme with glassmorphism, parallax scrolling, and expanding image animations.
* **Responsive Design:** Fully responsive layout with mobile-friendly sidebar drawers.
* **Interactive Components:**
    * **AI Concierge:** A chatbot sidebar for guest assistance.
    * **Mock Payment Gateway:** A credit card modal implementing the **Luhn Algorithm** for validation.
    * **Admin Dashboard:** Special controls for Admins to manage/clear rooms.
* **Easter Eggs:** Hidden developer credits for academic presentation.

### ⚙️ Backend (C++ Custom Server)
* **Native TCP Server:** Built using `winsock2.h` to handle HTTP requests (GET/POST) without external frameworks.
* **Data Persistence:** Automatic saving/loading of room bookings and revenue to `database.txt`.
* **Role-Based Access Control (RBAC):**
    * **Guest:** View rooms, chat with AI.
    * **Staff:** View bookings.
    * **Admin:** Clear occupied rooms, view total revenue.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, CSS3 (Variables, Animations, Flexbox/Grid).
* **Backend:** C++ (Standard Library + Winsock API).
* **Database:** Text-file based persistence (`database.txt`).
* **Fonts:** Cinzel (Luxury Serif), Great Vibes (Script), Inter (Body).

## 🚀 Installation & Setup

### 1. Backend Setup (C++)
Navigate to the root directory and compile the server:
```bash
g++ server.cpp -o hotel_server -lws2_32
./hotel_server