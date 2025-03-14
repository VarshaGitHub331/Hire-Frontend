# Hire-Frontend
This repository contains the **React.js frontend** for an AI-powered freelance marketplace where freelancers can create profiles, list gigs, and interact with clients. AI assists in skill recommendations, job matching, and proposal writing.

## 🚀 Features

### 🔹 Freelancer Features
- **AI-Powered Profile Creation**  
  - Upload a resume or manually select skills and categories.
  - AI extracts relevant skills and categories using **Gemini API**.
  - Uses **MiniLM-v6** to suggest related skills from the database.

- **Gig Creation & Management**  
  - Freelancers can create gigs, set pricing, and select features.
  - AI suggests **categories, skills, and descriptions** for gigs.
  - Inline editing for gig updates.

- **AI-Assisted Proposal Writing**  
  - AI-generated proposals for job postings.
  - Suggested **skills & categories** for targeted proposals.

### 🔹 Client Features
- **Smart Gig Recommendations**  
  - Enter a project description to receive **AI-matched gigs**.
  - Budget range, skills, and categories are extracted for better matching.

- **Job Posting with AI Tagging**  
  - Extracts **skills & categories** from job descriptions.
  - Freelancers receive **relevant job recommendations**.

- **Bid & Proposal Management**  
  - Clients receive **real-time bid notifications**.
  - View, accept, or reject proposals.

### 🔹 Real-time Collaboration & Performance
- **Live Chat** – Built with **Socket.IO** for real-time messaging.
- **Instant Notifications** – Uses **Redis** for order & bid updates.
- **Data Visualization** – Integrated **React Charts** for analytics.

## ⚙️ Tech Stack
- **React.js** – UI framework
- **Redux Toolkit** – State management
- **TanStack Query** – Data fetching & caching
- **Socket.IO** – Real-time chat
- **Redis** – Notifications & caching
- **React Charts** – Data visualization

## 🔧 Setup & Installation
```sh
   git clone https://github.com/VarshaGitHub331/Hire-Frontend
   cd freelance-marketplace-frontend
  npm install
  npm start

