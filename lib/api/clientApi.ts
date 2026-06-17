import { api } from "./api";
import type { User } from "@/types/user";

/* ================= AUTH ================= */

export const register = async (data: { email: string; password: string }) => {
  const res = await api.post<User>("/api/auth/register", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<User>("/api/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/api/auth/logout");
};

/* ================= SESSION ================= */

export const checkSession = async () => {
  try {
    await api.get("/api/auth/session");
    return true;
  } catch {
    return false;
  }
};

/* ================= USER ================= */

export const getMe = async () => {
  const res = await api.get<User>("/api/users/me");
  return res.data;
};

export const updateMe = async (data: Partial<User>) => {
  const res = await api.patch<User>("/api/users/me", data);
  return res.data;
};

/* ================= NOTES ================= */

export const fetchNotes = async (params?: {
  page?: number;
  search?: string;
  perPage?: number;
  tag?: string;
}) => {
  const res = await api.get("/api/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get(`/api/notes/${id}`);
  return res.data;
};

export const createNote = async (data: {
  title: string;
  content: string;
  tag: string;
}) => {
  const res = await api.post("/api/notes", data);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/api/notes/${id}`);
  return res.data;
};
