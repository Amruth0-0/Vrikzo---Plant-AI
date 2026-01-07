
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

`GEMINI_API_KEY`
`OPENWEATHER_API_KEY`
`EMAIL_USER`
`EMAIL_PASS`

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

