# Enterprise Notion - AI-Powered Document Workspace

A modern Notion-style document workspace with advanced AI capabilities for smarter document management and knowledge organization.

## 🌟 Features

### Core Features
- 📝 Rich Text Editor with Markdown Support
- 📁 Hierarchical Document Organization
- 👥 Multi-User Workspaces
- 🎨 Customizable UI with Dark/Light Mode

### AI-Powered Features
- 🤖 **AI Auto-Linker**
  - Automatically suggests links to related documents while writing
  - Creates a connected knowledge base
  - Improves document discoverability

- 🔍 **Knowledge Graph Builder**
  - Visualizes document relationships
  - Helps understand content connections
  - Interactive graph navigation

- 🏷️ **Auto Tag Generator**
  - AI-powered semantic tag suggestions
  - Improves document categorization
  - Enhanced search capabilities

- ❓ **Workspace Question Answering**
  - Natural language queries across workspace
  - Intelligent document context understanding
  - Quick information retrieval

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with Vite
- **UI Library**: Material-UI (MUI)
- **Rich Text Editor**: TipTap
- **State Management**: Zustand
- **Styling**: TailwindCSS + MUI Theming

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + Passport (Google OAuth)
- **File Storage**: Local/Cloud Storage
- **AI Integration**: Google's Generative AI

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- Google Cloud Account (for AI features)
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd enterprise-notion
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install

   # Configure environment variables
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   PORT=4567
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install

   # Configure environment variables
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   VITE_FRONTEND_URL=http://localhost:5173
   VITE_BACKEND_URL=http://localhost:4567
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start Development Servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd client
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

## 🔧 Project Structure

```
enterprise-notion/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── editor/       # Rich text editor components
│   │   │   ├── workspace/    # Workspace related components
│   │   │   └── ui/          # Common UI components
│   │   ├── pages/           # Page components
│   │   ├── stores/          # Zustand state stores
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── package.json
└── server/                    # Backend Express application
    ├── src/
    │   ├── config/          # Configuration files
    │   ├── controllers/     # Route controllers
    │   ├── models/         # MongoDB models
    │   ├── routes/         # API routes
    │   └── services/       # Business logic
    └── package.json
```

## 🔑 Key Features Implementation

### AI Auto-Linker
- Analyzes document content in real-time
- Uses semantic search to find related documents
- Suggests contextual links while writing

### Knowledge Graph
- Builds document relationship graph
- Uses AI to identify connections
- Interactive visualization with filtering

### Auto-Tagging
- Extracts key topics from content
- Generates semantic tags automatically
- Maintains tag consistency

### Question Answering
- Indexes workspace content
- Processes natural language queries
- Returns relevant document excerpts


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.

## 👥 Authors

- Shivam Chaudhary

## 💫 Acknowledgments

- TipTap for the rich text editor
- Material-UI for the component library
- Google's Generative AI for AI features
