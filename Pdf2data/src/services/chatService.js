import api from "./api";

/** Sidebar / History list of all chat sessions for the logged-in user */
export const getSessions = async () => {
  const response = await api.get("/chat/sessions");
  return response.data; // ChatSessionResponse[]
};

/** Full detail for one session: metadata + linked documents + messages */
export const getSessionDetails = async (sessionId) => {
  const response = await api.get(`/chat/session/${sessionId}`);
  return response.data; // ChatSessionDetailsResponse
};

/** Ask the AI a question inside a chat session */
export const askQuestion = async (chatSessionId, message) => {
  const response = await api.post("/chat/ask", { chatSessionId, message });
  return response.data; // { chatSessionId, reply }
};

/** Raw message history for a session */
export const getChatHistory = async (chatSessionId) => {
  const response = await api.get(`/chat/history/${chatSessionId}`);
  return response.data; // ChatHistory[]
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
