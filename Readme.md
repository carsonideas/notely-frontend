# Notely - Notes Application

A modern, full-featured notes application built with React, TypeScript, and Material-UI. Features include CRUD operations, image uploads via Cloudinary, pop-up modals for creating/editing notes, and a responsive design.

## Features

- ✅ **Full CRUD Operations**: Create, read, update, and delete notes
- ✅ **Pop-up Modals**: Create and edit notes in modal dialogs
- ✅ **Profile Modal**: View and edit user profile in a pop-up
- ✅ **Image Upload**: Upload images to notes using Cloudinary integration
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Search Functionality**: Search notes by title, content, or author
- ✅ **User Authentication**: Login/register system with protected routes
- ✅ **Markdown Support**: Write notes in Markdown format with live preview
- ✅ **Modern UI**: Clean, professional interface using Material-UI

## Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Image Upload**: Cloudinary
- **Markdown**: Marked.js with DOMPurify
- **Build Tool**: Vite
- **Styling**: Material-UI with custom theming

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CreateNoteModal.tsx    # Modal for creating notes
│   ├── EditNoteModal.tsx      # Modal for editing notes
│   ├── ProfileModal.tsx       # Modal for user profile
│   ├── NoteCard.tsx          # Note display card
│   ├── NoteContent.tsx       # Markdown content renderer
│   ├── Header.tsx            # Navigation header
│   └── ...
├── pages/              # Page components
│   ├── NotesPage.tsx         # Main notes listing page
│   ├── NoteDetailPage.tsx    # Individual note view
│   ├── LandingPage.tsx       # Home page
│   ├── LoginPage.tsx         # Login form
│   └── ...
├── stores/             # State management
│   ├── noteStore.ts          # Notes state and actions
│   └── authStore.ts          # Authentication state
├── types/              # TypeScript type definitions
│   ├── Note.ts               # Note-related types
│   ├── User.ts               # User-related types
│   └── Auth.ts               # Auth-related types
├── utils/              # Utility functions
│   ├── cloudinary.ts         # Cloudinary integration
│   ├── api.ts                # API client
│   ├── validation.ts         # Form validation
│   └── ...
└── App.tsx             # Main app component
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Cloudinary Configuration (required for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
VITE_CLOUDINARY_API_KEY=your-api-key
```

### 3. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name from the dashboard
3. Create an upload preset:
   - Go to Settings → Upload
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Save the preset name
4. Update your `.env` file with these values

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Key Components

### NotesPage
- Main page displaying all notes in a grid layout
- Search functionality
- Floating action button to create new notes
- Opens create/edit modals instead of navigating to separate pages

### Modal Components
- **CreateNoteModal**: Full-featured note creation with image upload
- **EditNoteModal**: Edit existing notes with image management
- **ProfileModal**: View and edit user profile information

### Image Upload
- Drag-and-drop or click to upload images
- Automatic Cloudinary integration
- Image preview and removal functionality
- Images are embedded in note content as Markdown

### State Management
- Uses Zustand for lightweight state management
- Separate stores for notes and authentication
- Automatic error handling and loading states

## API Integration

The app expects a backend API with the following endpoints:

```
GET    /api/notes          # Get all notes
GET    /api/notes/:id      # Get single note
POST   /api/notes          # Create note
PUT    /api/notes/:id      # Update note
DELETE /api/notes/:id      # Delete note
POST   /api/auth/login     # User login
POST   /api/auth/register  # User registration
GET    /api/auth/me        # Get current user
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features in Detail

### Note Creation/Editing
- Rich text editor with Markdown support
- Live preview of formatted content
- Image upload with Cloudinary integration
- Form validation for title, synopsis, and content

### User Interface
- Material-UI components for consistent design
- Responsive layout that works on all screen sizes
- Dark/light theme support
- Smooth animations and transitions

### Search and Filtering
- Real-time search across note titles, content, and authors
- Filter results as you type
- Search result count display

### Authentication
- Protected routes that require login
- Persistent login state
- User profile management

## Troubleshooting

### Common Issues

1. **Cloudinary Upload Fails**
   - Check your environment variables are set correctly
   - Ensure upload preset is set to "unsigned"
   - Verify your cloud name is correct

2. **API Connection Issues**
   - Make sure your backend server is running
   - Check the `VITE_API_BASE_URL` in your `.env` file
   - Verify CORS is configured on your backend

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Clear node_modules and reinstall if needed: `rm -rf node_modules package-lock.json && npm install`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

