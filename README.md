# Learning Management System (LMS)

![LMS](https://img.shields.io/badge/Status-Complete-green)  
A modern Learning Management System designed to streamline online education delivery, course management, and communication between students and instructors.

## Description

This LMS is a scalable, user-friendly platform that allows instructors to create and manage courses while enabling students to enroll, view lectures, track progress, and interact through reviews and feedback. It integrates payment gateways, responsive UI/UX design, and secure authentication, serving as a complete digital learning solution.

**Keywords**: LMS, online education, e-learning, React, Node.js, MongoDB, Stripe.

## Features

### Functional Requirements
- **User Authentication**: Signup, login, logout (JWT-based).
- **Instructor Dashboard**: Create/edit courses, upload videos, track enrollment.
- **Student Dashboard**: Enroll in courses, track progress, leave reviews.
- **Admin Panel**: Manage users and courses (optional).
- **Payment System**: Integrated Stripe checkout.
- **Responsive Design**: Works seamlessly on mobile and desktop.
- **Course Management**: Modules, lectures, rich-text descriptions.
- **Progress Tracking**: Mark lectures as completed, course completion status.
- **Ratings & Reviews**: Students can rate and review courses.

### Non-Functional Requirements
- **Performance**: Optimized API calls with RTK Query.
- **Security**: Token-based authentication, hashed passwords.
- **Scalability**: Modular architecture for easy expansion.
- **Availability**: Hosted on Vercel (frontend) and Render/DigitalOcean (backend).

## Technologies Used

### Frontend
- **React JS** (UI components)
- **Tailwind CSS** (styling)
- **Redux Toolkit & RTK Query** (state management)
- **React Router DOM** (client-side routing)

### Backend
- **Node.js & Express.js** (RESTful APIs)
- **MongoDB & Mongoose** (database modeling)

### Additional Tools
- **Stripe API** (payments)
- **Cloudinary** (media storage)
- **JWT** (authentication)
- **Multer** (file uploads)

## Installation

1. **Clone the repository**  
   ```bash
   git clone [repository-url]
   cd lms-project
