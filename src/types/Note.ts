export interface Note {
  id: string
  title: string
  synopsis: string
  content: string
  authorId: string
  author?: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  title: string
  synopsis: string
  content: string
}

export interface UpdateNoteRequest {
  title: string
  synopsis: string
  content: string
}

