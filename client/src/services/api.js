import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const login = async (userId) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { userId });
  return res.data;
};

export const getProfile = async (userId) => {
  const res = await axios.get(`${API_BASE}/auth/profile`, { params: { userId } });
  return res.data;
};

export const updateProfile = async (userId, profile) => {
  const res = await axios.post(`${API_BASE}/auth/profile`, { userId, profile });
  return res.data;
};

export const getQuestionnaire = async () => {
  const res = await axios.get(`${API_BASE}/questionnaire`);
  return res.data;
};

export const sendQuestionnaireAnswers = async (payload) => {
  const res = await axios.post(`${API_BASE}/questionnaire/answers`, payload);
  return res.data;
};

export const getUserSettings = async (userId) => {
  const res = await axios.get(`${API_BASE}/settings`, { params: { userId } });
  return res.data;
};

export const updateUserSettings = async (userId, settings) => {
  const res = await axios.post(`${API_BASE}/settings`, { userId, settings });
  return res.data;
};

export const getExpertData = async (userId, expertName) => {
  const res = await axios.get(`${API_BASE}/expert`, { params: { userId, expertName } });
  return res.data;
};

// Aggiungi qui la funzione getSessions
export const getSessions = async (userId) => {
  const res = await axios.get(`${API_BASE}/questionnaire/sessions`, { params: { userId } });
  return res.data;
};
