# Live Polling System

A real-time interactive polling platform for classrooms, training, or live audience engagement. Built with React, TypeScript, Node.js, and Socket.IO.

---

## Features

### Teacher Dashboard
- Create multiple-choice polls with time limits (default: 60 seconds)
- View real-time results with animated progress bars
- Manage connected students (view/kick participants)
- Access past poll results and analytics
- Communicate through a built-in live chat

### Student Dashboard
- Join sessions easily by entering a name (per browser tab)
- Submit answers within live time constraints
- View poll results immediately after submission
- Chat with the teacher and fellow students
- Session persists across tab refreshes

### System Highlights
- Real-time updates powered by Socket.IO
- Responsive UI for desktop and mobile
- Automatic handling of joins, leaves, and disconnections

---

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS

---

## Architecture Overview

- **Client-Server Model**: Real-time communication via WebSockets
- **Data Flow**:
  - Teacher creates a poll → Server broadcasts it to students
  - Students submit answers → Server updates and pushes results in real-time
  - Results saved to poll history for later viewing

