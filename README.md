
# 🌱 VrikZo – AI-Powered Plant Disease Detection & Care System

VrikZo is an AI-powered web application designed to help users detect plant diseases from uploaded images and receive intelligent treatment and prevention recommendations. The platform also supports automated plant care reminders and weather-aware guidance to promote consistent and effective plant maintenance.

This project was developed as a collaborative effort, combining backend services, AI integration, and frontend interfaces to deliver a practical, real-world solution. 

<br>

## ✨ Features

- Image-based plant disease detection
- AI-generated treatment and prevention recommendations
- Automated watering and treatment reminders via email
- Weather-aware plant care suggestions
- RESTful backend APIs for scalable data handling

<br>

## 🧰 Tech Stack

**Backend:** Node.js, Express.js, MongoDB \
**AI / ML:** Python (CNN), Google Gemini API \
**APIs & Services:** OpenWeather API, Nodemailer, Cron \
**Frontend:** React, TypeScript 

<br>

## ⚙️ Run Locally

Clone the project

```bash
  git clone https://github.com/Amruth0-0/Vrikzo---Plant-AI.git
```

Go to the project directory

```bash
  cd Vrikzo---Plant-AI
```

Install dependencies

```bash
  npm install
```

Start the server & client concurrently

```bash
  npm run dev
```

<br>

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT=5000` \
`MONGODB_URI=your_mongodb_atlas_connection_string` \
`GEMINI_API_KEY=your_gemini_api_key` \
`OPENWEATHER_API_KEY=your_openweather_api_key` \
`EMAIL_USER=your_email_address` \
`EMAIL_PASS=your_email_password` 

The application requires a valid MongoDB Atlas connection to run.

<br>

## 🗄️ Database Setup

This project uses MongoDB Atlas as its primary database.
- The database schema and collections are defined using Mongoose models in the codebase
- No manual database or collection creation is required
- Collections are automatically created when the application runs and data is inserted

MongoDB Setup Steps:
1.  Create a cluster on MongoDB Atlas
2. Copy the cluster connection string
3. Add the connection string to the MONGODB_URI environment variable
4. Whitelist your IP address in Atlas network access settings

<br>

## 📡 API Reference

#### Diagnose Plant Disease

```http
 POST /api/diagnose
```
Uploads a plant image and returns diagnosis details and AI-generated recommendations.

#### Schedule Care Reminder

```http
  POST /api/reminders
```
Creates a watering or treatment reminder for scheduled email notifications.

#### Get Scheduled Reminders

```http
GET /api/reminders
```
Fetches existing care reminders for a user.

<br>

## 👥 Authors
This project was developed as a collaborative team effort.
- [@Amruth0-0](https://www.github.com/Amruth0-0)

<br>

## 🛣️ Roadmap

- User authentication and role-based access
- Improved AI model accuracy
- Enhanced scheduling and notification features

