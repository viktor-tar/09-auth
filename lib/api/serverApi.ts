import { api } from "./api";
import type { User } from "@/types/user";

interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number;
  tag?: string;
}

/* ================= NOTES ================= */

export const fetchNotes = async (params: FetchNotesParams, cookies: string) => {
  const res = await api.get("/api/notes", {
    params,
    headers: {
      Cookie: cookies,
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string, cookies: string) => {
  const res = await api.get(`/api/notes/${id}`, {
    headers: {
      Cookie: cookies,
    },
  });

  return res.data;
};

/* ================= USER ================= */

export const getMe = async (cookies: string) => {
  const res = await api.get<User>("/api/users/me", {
    headers: {
      Cookie: cookies,
    },
  });

  return res.data;
};

/* ================= SESSION ================= */

export const checkSession = async (cookies: string): Promise<boolean> => {
  try {
    await api.get("/api/auth/session", {
      headers: {
        Cookie: cookies,
      },
    });

    return true;
  } catch {
    return false;
  }
};
