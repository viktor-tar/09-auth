import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

/* ================= AUTH ================= */

export const register = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/* ================= SESSION ================= */

export const checkSession = async (): Promise<{ success: boolean }> => {
  try {
    const res = await api.get<{ success: boolean }>("/auth/session");
    return res.data;
  } catch {
    return { success: false };
  }
};

/* ================= USER ================= */

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
};

/* ================= NOTES ================= */

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (params?: {
  page?: number;
  search?: string;
  perPage?: number;
  tag?: string;
}): Promise<NotesResponse> => {
  const res = await api.get<NotesResponse>("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: {
  title: string;
  content: string;
  tag: Note["tag"];
}): Promise<Note> => {
  const res = await api.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
