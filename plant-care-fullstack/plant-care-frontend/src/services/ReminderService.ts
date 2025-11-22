import axios from "axios";

const API = "http://localhost:5000/api/reminders";

export const createReminder = (data: {
  email: string;
  plantName: string;
  action: string;
  scheduleDate: string;
}) => axios.post(`${API}/create`, data);
