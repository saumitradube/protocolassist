# Clinical Protocol Assistant - Frontend

React TypeScript frontend with Tailwind CSS for the clinical protocol chat interface.

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set the backend API URL:

```
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

- **Modern Chat UI**: Beautiful message bubbles with user/AI avatars
- **File Upload**: Drag-and-drop or click to upload PDF files
- **Source Citations**: Right panel showing document references
- **Dark Mode**: Toggle between light and dark themes
- **Animations**: Smooth fade and slide animations using Framer Motion
- **Responsive Design**: Works on different screen sizes

## Project Structure

```
src/
  ├── api/           # API client and functions
  ├── components/    # React components
  ├── hooks/         # Custom React hooks
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main app component
  └── index.tsx      # Entry point
```

## Components

- **ChatLayout**: Main chat interface with messages and input
- **ChatMessage**: Individual message bubble component
- **ChatInput**: Text input with send button
- **FileUploadArea**: Drag-and-drop file upload component
- **SourceCitationPanel**: Right sidebar showing document sources
- **LoadingDots**: Animated loading indicator

## API Integration

The frontend communicates with the backend API at the URL specified in `REACT_APP_API_BASE_URL`.

Key API functions:
- `uploadDocuments(files)`: Upload PDF files and create session
- `sendMessage(request)`: Send chat message and get AI response
- `healthCheck()`: Check backend health

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

