import api from "./api";

export const getSessions = async () => {
  const response = await api.get("/chat/sessions");
  return response.data; 
};

export const getSessionDetails = async (sessionId) => {
  const response = await api.get(`/chat/session/${sessionId}`);
  return response.data; 
};

export const askQuestion = async (chatSessionId, message) => {
  const response = await api.post("/chat/ask", { chatSessionId, message });
  return response.data; 
};

export const getChatHistory = async (chatSessionId) => {
  const response = await api.get(`/chat/history/${chatSessionId}`);
  return response.data; 
};

export const renameSession = async (sessionId, title) => {
  const response = await api.patch(
    `/chat/session/${sessionId}/rename`,
    null,
    { params: { title } }
  );
  return response.data;
};

export const togglePinSession = async (sessionId) => {
  const response = await api.patch(`/chat/session/${sessionId}/pin`);
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/chat/session/${sessionId}`);
  return response.data;
};
