Live Polling System
A real-time interactive polling platform built with React, TypeScript, and Socket.IO, designed for classrooms, training sessions, and live audience feedback.

Features
Teacher Dashboard
Create polls with custom multiple-choice options and timers

View real-time results with animated progress bars

Manage student connections (view, remove participants)

Access past poll history and analytics

Built-in chat to communicate with students

Student Dashboard
Join easily by entering name (session persists per tab)

Participate in live polls with time limits

See real-time results after submission

Chat with teacher and other students

System Highlights
Real-time updates using WebSockets (Socket.IO)

Fully responsive UI for all devices

Automatic connection and disconnection handling

Tech Stack
Frontend
React 18

TypeScript

Tailwind CSS

Lucide React

Socket.IO Client

Backend
Node.js

Express.js

Socket.IO

CORS

Architecture
Client-server model with WebSocket connections

Teacher creates poll → Server broadcasts → Students respond

Responses are updated live and stored in poll history

Setup & Installation
Prerequisites

Node.js v16+

npm or yarn

Steps

bash
Copy
Edit
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start both frontend and backend
npm start
Development

bash
Copy
Edit
npm run server    # Start backend  
npm run dev       # Start frontend  
Deployment
Frontend: Netlify, Vercel, or any static host

Backend: Railway, Heroku, or any Node.js platform

Browser Support
Compatible with Chrome, Firefox, Safari, Edge, and major mobile browsers.

Security Features
Session-based WebSocket connections

Input sanitization

CORS policies

Connection limits to prevent spamming
