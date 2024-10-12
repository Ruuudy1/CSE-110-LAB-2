import './App.css';
import { Label, Note } from "./types";
import { dummyNotesList } from "./constants";
import { useState } from "react";

function App() {
  const initialNote = {
    id: -1,
    title: "",
    content: "",
    label: Label.other,
  };

  const [notes, setNotes] = useState<Note[]>(dummyNotesList);
  const [createNote, setCreateNote] = useState<Note>(initialNote);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for theme toggle

  // Function to toggle favorite
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Function to handle creation of a new note
  const createNoteHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const newNote = { ...createNote, id: notes.length + 1 };
    setNotes([newNote, ...notes]);
    setCreateNote(initialNote);
  };

  // Function to handle deleting a note
  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Function to handle updating a note
  const handleUpdate = (id: number, field: keyof Note, value: string) => {
    setNotes(
      notes.map(note =>
        note.id === id ? { ...note, [field]: value } : note
      )
    );
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`app-container ${isDarkTheme ? 'dark' : 'light'}`}>
      {/* Sidebar for creating notes */}
      <div className="sidebar">
        <form className="note-form" onSubmit={createNoteHandler}>
          <input
            placeholder="Note Title"
            value={createNote.title}
            onChange={(event) =>
              setCreateNote({ ...createNote, title: event.target.value })
            }
            required
          />
          <textarea
            placeholder="Note Content"
            value={createNote.content}
            onChange={(event) =>
              setCreateNote({ ...createNote, content: event.target.value })
            }
            required
          />
          <select
            value={createNote.label}
            onChange={(event) =>
              setCreateNote({ ...createNote, label: event.target.value as Label })
            }
            required
          >
            <option value={Label.other}>Other</option>
            <option value={Label.personal}>Personal</option>
            <option value={Label.work}>Work</option>
            <option value={Label.study}>Study</option>
          </select>
          <button type="submit">Create Note</button>
        </form>

        {/* List of favorite notes */}
        <div className="favorites-list">
          <h3>List of favorites:</h3>
          <ul>
            {favorites.map(favId => {
              const favoriteNote = notes.find(note => note.id === favId);
              return <li key={favId}>{favoriteNote?.title}</li>;
            })}
          </ul>
        </div>

        {/* Theme Toggle Button at the bottom */}
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </button>
        </div>
      </div>

      {/* Notes grid */}
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <div className="notes-header">
              <button onClick={() => deleteNote(note.id)}>x</button>
              <span
                className={`favorite ${favorites.includes(note.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(note.id)}>
                ♥
              </span>
            </div>
            {/* Editable Title and Content */}
            <h2
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) =>
                handleUpdate(note.id, "title", event.target.textContent || "")
              }
            >
              {note.title}
            </h2>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) =>
                handleUpdate(note.id, "content", event.target.textContent || "")
              }
            >
              {note.content}
            </p>
            <p>{note.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
