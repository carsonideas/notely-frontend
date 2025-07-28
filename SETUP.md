# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your Cloudinary credentials:
- Sign up at https://cloudinary.com
- Get your Cloud Name, Upload Preset, and API Key
- Update the `.env` file

## 3. Start Development Server
```bash
npm run dev
```

## 4. Access the Application
Open http://localhost:3001 in your browser

## Key Features Implemented:
✅ Notes page with modal-based create/edit (no separate routes)
✅ Profile modal popup (no separate profile page route)
✅ Full CRUD operations for notes
✅ Cloudinary image upload in create/edit modals
✅ All "blog" references replaced with "note/notes"
✅ Responsive design with Material-UI
✅ Search functionality
✅ User authentication

## File Structure:
- `src/pages/NotesPage.tsx` - Main notes page (renamed from BlogsPage)
- `src/components/CreateNoteModal.tsx` - Create note modal
- `src/components/EditNoteModal.tsx` - Edit note modal  
- `src/components/ProfileModal.tsx` - Profile modal
- `src/utils/cloudinary.ts` - Cloudinary integration
- All components use "note" terminology instead of "blog"

