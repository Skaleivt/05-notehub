// fetchNotes : має виконувати запит для отримання колекції нотатків із сервера. Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);
// createNote: має виконувати запит для створення нової нотатки на сервері. Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором. Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.

import axios from "axios";
import type { Note } from "../types/note.ts";
import type { OrderFormValues } from "../components/NoteForm/NoteForm.tsx";

interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
}
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const myKey = import.meta.env.VITE_API_KEY;

export async function fetchNotes(
  searchQuery: string,
  page: number
): Promise<NoteSearchResponse> {
  const response = await axios.get<NoteSearchResponse>(`/notes`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
    params: {
      ...(searchQuery && { search: searchQuery }),
      perPage: 12,
      page,
    },
  });
  console.log(response.data);
  const filteredNotes = response.data.notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return {
    ...response.data,
    notes: filteredNotes,
  };
}

export async function createNote(values: OrderFormValues) {
  await axios.post(`/notes`, values, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
}

export async function deleteNote(id: number) {
  await axios.delete(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
}
