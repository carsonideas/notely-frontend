import { create } from 'zustand';
import { apiClient } from '../utils/api';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/Note';

interface NoteStore {
  notes: Note[];
  deletedNotes: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  fetchDeletedNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (noteData: CreateNoteRequest) => Promise<Note>;
  updateNote: (id: string, noteData: UpdateNoteRequest) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  deletedNotes: [],
  currentNote: null,
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<{ notes: Note[] }>('/api/notes');
      set({ notes: response.notes || response, loading: false });
    } catch (error: any) {
      console.error('Fetch notes error:', error);
      set({ error: error.message  || '& Failed to fetch notes', loading: false });
      throw error;
    }
  },

  fetchDeletedNotes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<{ notes: Note[] }>('/api/notes/trash');
      set({ deletedNotes: response.notes || response, loading: false });
    } catch (error: any) {
      console.error('Fetch deleted notes error:', error);
      set({ error: error.message || 'Failed to fetch deleted notes', loading: false });
      throw error;
    }
  },

  fetchNoteById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<{ note: Note }>(`/api/notes/${id}`);
      set({ currentNote: response.note || response, loading: false });
    } catch (error: any) {
      console.error('Fetch note by ID error:', error);
      set({ error: error.message || 'Failed to fetch note', loading: false });
      throw error;
    }
  },

  createNote: async (noteData: CreateNoteRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post<{ note: Note }>('/api/notes', noteData);
      const newNote = response.note || response;
      set((state) => ({
        notes: [newNote, ...state.notes],
        loading: false
      }));
      return newNote;
    } catch (error: any) {
      console.error('Create note error:', error);
      set({ error: error.message || 'Failed to create note', loading: false });
      throw error;
    }
  },

  updateNote: async (id: string, noteData: UpdateNoteRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put<{ note: Note }>(`/api/notes/${id}`, noteData);
      const updatedNote = response.note || response;
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? updatedNote : note
        ),
        currentNote: updatedNote,
        loading: false
      }));
    } catch (error: any) {
      console.error('Update note error:', error);
      set({ error: error.message || 'Failed to update note', loading: false });
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/api/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Delete note error:', error);
      set({ error: error.message || 'Failed to delete note', loading: false });
      throw error;
    }
  },

  restoreNote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.patch<{ note: Note }>(`/api/notes/restore/${id}`);
      const restoredNote = response.note || response;
      set((state) => ({
        deletedNotes: state.deletedNotes.filter((note) => note.id !== id),
        notes: [restoredNote, ...state.notes],
        loading: false
      }));
    } catch (error: any) {
      console.error('Restore note error:', error);
      set({ error: error.message || 'Failed to restore note', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

