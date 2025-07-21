import css from "../NoteList/NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListPops {
  notes: Note[];
  onClick: (id: number) => void;
}

export default function NoteList({ notes, onClick }: NoteListPops) {
  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => onClick(note.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
