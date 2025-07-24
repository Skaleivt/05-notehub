import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_API_KEY;

// Отримання нотаток із фільтром і пагінацією
export async function fetchNotes(
  searchQuery: string,
  page: number
): Promise<NoteSearchResponse> {
  const response = await axios.get<NoteSearchResponse>(`/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ...(searchQuery && { search: searchQuery }),
      perPage: 12,
      page,
    },
  });

  return {
    ...response.data,
  };
}

// Створення нової нотатки
export async function createNote(noteData: NewNote): Promise<Note> {
  const response = await axios.post<Note>(`/notes`, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Видалення нотатки
export async function deleteNote(id: number): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
