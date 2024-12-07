# WhatsApp Clone

This is a full-stack **WhatsApp Clone** application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It provides core functionalities such as real-time messaging, voice and video calls, media sharing, and push notifications, mimicking the core features of WhatsApp.

## Features

- **Real-time messaging**: Instant text messages with Socket.IO for real-time communication.
- **Voice and video calls**: Peer-to-peer calling functionality using WebRTC.
- **Group chats**: Support for creating and managing group chats.
- **Media sharing**: Send and receive images, videos, and documents.
- **User authentication**: Sign-up and login using JWT tokens.
- **Push notifications**: Notifications for new messages when offline.
- **Online/offline status**: Display user availability based on their connection.
- **Search functionality**: Search through users, messages, and contacts.

## Technologies Used

### Frontend

- **React.js**: A JavaScript library for building dynamic user interfaces.
- **React Router**: For navigation and routing within the app.
- **Redux**: For managing global state, such as message updates and user authentication.
- **Socket.IO**: For real-time communication between the server and clients.
- **Material-UI**: For building responsive and modern UI components.
- **WebRTC**: For real-time voice and video calling.

### Backend

- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Web framework for building RESTful APIs and handling HTTP requests.
- **MongoDB**: NoSQL database for storing user data, messages, media, and more.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Socket.IO**: For enabling real-time messaging between users.
- **Firebase Cloud Storage**: For storing media files (images, videos).

## Installation

### Prerequisites

1. **Node.js** and **npm** installed.
2. **MongoDB** or **MongoDB Atlas** account for database hosting.

### Steps to Run Locally

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/whatsapp-clone.git
cd whatsapp-clone
cd frontend
npm install
