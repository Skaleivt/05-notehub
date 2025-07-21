import css from "./App.module.css";
import { useState, useEffect, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import type { OrderFormValues } from "../NoteForm/NoteForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showErrorToast } from "../showErrorToast/showErrorToast";
import { ToastContainer } from "react-toastify";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const updateSearchQuery = useDebouncedCallback(
    (value: string) => setSearchQuery(value),
    300
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  const handleFormSubmit = (values: OrderFormValues) => {
    createNoteMutation(values);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["note", searchQuery, currentPage],
    queryFn: () => fetchNotes(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const { mutate: createNoteMutation } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      setModalOpen(false);
    },
    onError: () => {
      showErrorToast("Error creating note");
    },
  });

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      queryClient.invalidateQueries({ queryKey: ["note"] });
    } catch {
      showErrorToast("Error deleting note");
    }
  };

  const totalPages = data?.totalPages || 0;

  const noNotesToastShown = useRef(false);

  useEffect(() => {
    if (!isLoading && data && data.notes.length === 0) {
      if (!noNotesToastShown.current) {
        showErrorToast("No notes found for your request.");
        noNotesToastShown.current = true;
      }
    } else {
      noNotesToastShown.current = false;
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (isError) {
      showErrorToast("Помилка");
    }
  }, [isError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          {<SearchBox onChange={handleInputChange} value={inputValue} />}
          {totalPages > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
          {
            <button onClick={() => setModalOpen(true)} className={css.button}>
              Create note +
            </button>
          }
          {isModalOpen && (
            <Modal onClose={() => setModalOpen(false)}>
              <NoteForm
                onCancel={() => setModalOpen(false)}
                onSubmit={handleFormSubmit}
              />
            </Modal>
          )}
        </header>
        {isLoading && <Loader />}
        {isSuccess && (
          <NoteList notes={data.notes} onClick={handleDeleteNote} />
        )}
        {isError}
        <ToastContainer />
      </div>
    </>
  );
}
