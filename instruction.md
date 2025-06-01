# NovaDocs Implementation Instructions

## Rules for Development

**No Hallucination**: Only implement features explicitly defined in the PRD.
**Test-Driven Development**: Every feature must have corresponding test cases.
**Error Handling**: Implement proper error handling for each component.
**Phased Approach**: Wait for explicit instruction to move to the next phase.
**Completion Checklist**: Features should be marked complete (✅) only after successful testing.
**Code Quality**: Follow best practices for the respective language/framework.
**Code structure**: use exisiting coding pattern.Use Material UI.


## Phase 1: Core Backend Infrastructure

### Phase 1.0: Backend Setup & Authentication (Current)

- [✅] Set up Express/Node.js server structure
- [✅] Configure MongoDB connection
- [✅] Implement JWT authentication system
  - [✅] User registration
  - [✅] Login functionality
  - [✅] Password reset flow
- [✅] Create user model with proper validation
- [✅] Implement middleware for protected routes
- [✅] Set up environment configuration
- [ ] Create API documentation

**Testing Checklist:**

- [✅] Test MongoDB connection and error handling
- [✅] Test user registration with valid/invalid data
- [✅] Test login with correct/incorrect credentials
- [✅] Test JWT token generation and verification
- [✅] Test protected route middleware
- [✅] Test password reset flow
- [ ] Run performance tests on authentication endpoints

### Phase 1.1: Frontend Authentication & Base UI

- [✅] Set up React project structure with Vite/Next.js
- [✅] Implement TailwindCSS configuration
- [✅] Create authentication context and providers
- [✅] Build login page UI
- [✅] Build registration page UI
- [✅] Build password reset pages
- [✅] Create protected route system
- [✅] Implement form validation
- [✅] Connect auth APIs to frontend
- [✅] Create basic layout components (Header, Footer)
- [✅] Implement theme toggle functionality

**Testing Checklist:**

- [✅] Test authentication flow (registration, login, logout)
- [✅] Test form validation for all inputs
- [✅] Test responsive design across devices
- [✅] Test protected route redirects
- [✅] Test theme toggling
- [✅] Test error handling for API failures

## Phase 2: Workspace & Document Structure

### Phase 2.0: Backend Workspace & Document APIs

- [ ] Design workspace data model
- [ ] Create document data model with nested structure support
- [ ] Implement workspace CRUD operations
- [ ] Implement document CRUD operations
- [ ] Build API for hierarchical document structure
- [ ] Implement document sharing & permissions
- [ ] Create search functionality for documents
- [ ] Set up file upload system for document attachments
- [ ] Workspace owner can invite multiple user and give permission to edit or only view.(multiple role)

**Testing Checklist:**

- [ ] Test workspace creation, retrieval, update and deletion
- [ ] Test document CRUD operations
- [ ] Test nested document structure operations
- [ ] Test permission system for shared workspaces
- [ ] Test search functionality with various queries
- [ ] Test file upload/download operations
- [ ] Performance testing for document tree retrieval

### Phase 2.1: Frontend Workspace & Navigation

- [ ] Implement sidebar navigation component
- [ ] Create workspace management UI
- [ ] Build document tree visualization
- [ ] Implement document creation flow
- [ ] Create breadcrumb navigation system
- [ ] Build favorites/starred pages feature
- [ ] Implement search interface
- [ ] Create drag-and-drop for document reordering

**Testing Checklist:**

- [ ] Test sidebar navigation rendering and interactions
- [ ] Test workspace switching functionality
- [ ] Test document creation, editing, deletion flows
- [ ] Test nested document navigation
- [ ] Test breadcrumb navigation accuracy
- [ ] Test favorites functionality
- [ ] Test search results rendering
- [ ] Test drag-and-drop reordering of documents

## Phase 3: Document Editor Implementation

### Phase 3.0: Backend Editor Support

- [ ] Create API for saving document content blocks
- [ ] Implement version history system
- [ ] Build backend support for markdown parsing
- [ ] Create API endpoints for image and file uploads
- [ ] Set up real-time sync infrastructure
- [ ] Implement CRDT data structure for conflict resolution
- [ ] Create endpoints for embedded content retrieval

**Testing Checklist:**

- [ ] Test document content storage and retrieval
- [ ] Test version history functionality
- [ ] Test markdown conversion accuracy
- [ ] Test file upload limits and security
- [ ] Test real-time sync with concurrent operations
- [ ] Test conflict resolution in multi-user scenarios
- [ ] Test performance under load with large documents

### Phase 3.1: Frontend Rich Text Editor

- [ ] Integrate rich text editor library (TipTap/Slate)
- [ ] Implement basic formatting tools (headers, lists, etc.)
- [ ] Create block-based content system
- [ ] Build table editor functionality
- [ ] Implement code blocks with syntax highlighting
- [ ] Create image/file embedding UI
- [ ] Build drag-and-drop for content blocks
- [ ] Implement markdown support
- [ ] Create social media embed functionality

**Testing Checklist:**

- [ ] Test all formatting options
- [ ] Test block operations (create, move, delete)
- [ ] Test table editing functionality
- [ ] Test code block syntax highlighting
- [ ] Test image/file uploads and embedding
- [ ] Test drag-and-drop functionality
- [ ] Test markdown parsing and rendering
- [ ] Test social media embeds

## Phase 4: Real-Time Collaboration

### Phase 4.0: Backend Collaboration Infrastructure

- [ ] Implement WebSocket connections
- [ ] Build CRDT server-side handling
- [ ] Create presence indicators for active users
- [ ] Implement cursor position sharing
- [ ] Build concurrent editing conflict resolution
- [ ] Create versioning system for document changes

**Testing Checklist:**

- [ ] Test WebSocket connection stability
- [ ] Test concurrent editing scenarios
- [ ] Test presence indicator accuracy
- [ ] Test cursor position sync between users
- [ ] Test conflict resolution in edge cases
- [ ] Test version history recording accuracy
- [ ] Performance testing with multiple concurrent users

### Phase 4.1: Frontend Collaboration Features

- [ ] Implement real-time editor synchronization
- [ ] Build user presence indicators
- [ ] Create cursor and selection visualization
- [ ] Implement version history browser
- [ ] Build collaboration invitation interface
- [ ] Create permissions management UI

**Testing Checklist:**

- [ ] Test real-time updates between multiple clients
- [ ] Test presence indicators rendering
- [ ] Test cursor positions across different devices
- [ ] Test version history browser functionality
- [ ] Test invitation flow for workspace collaboration
- [ ] Test permissions changes and effects

## Phase 5: AI Integration

### Phase 5.0: Backend AI Infrastructure

- [ ] Set up secure API key management for Gemini/OpenAI
- [ ] Implement vector database for document embeddings
- [ ] Build embeddings generation for document content
- [ ] Create graph database for knowledge connections
- [ ] Implement AI tagging system
- [ ] Build question-answering API endpoints
- [ ] Create auto-linking suggestion system

**Testing Checklist:**

- [ ] Test API key security and rotation
- [ ] Test vector embedding generation and storage
- [ ] Test semantic search performance
- [ ] Test graph database connections and queries
- [ ] Test AI tagging accuracy and performance
- [ ] Test Q&A system with various query types
- [ ] Test auto-linking suggestion relevance

### Phase 5.1: Frontend AI Features

- [ ] Implement AI auto-linker UI components
- [ ] Build knowledge graph visualization
- [ ] Create auto tag interface and editing
- [ ] Implement question-answering UI
- [ ] Build feedback mechanisms for AI features
- [ ] Create settings for AI feature preferences

**Testing Checklist:**

- [ ] Test auto-linker UI interactions
- [ ] Test knowledge graph rendering and interaction
- [ ] Test auto tag display and editing
- [ ] Test Q&A interface usability
- [ ] Test feedback collection system
- [ ] Test AI settings customization

## Phase 6: Performance Optimization & Deployment

### Phase 6.0: Backend Optimization

- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Set up monitoring and logging
- [ ] Create automated backup system
- [ ] Implement rate limiting
- [ ] Configure production environment

**Testing Checklist:**

- [ ] Load testing with expected user volumes
- [ ] Test cache hit/miss ratios
- [ ] Test database performance optimization
- [ ] Verify monitoring coverage
- [ ] Test backup and restore procedures
- [ ] Test rate limiting effectiveness

### Phase 6.1: Frontend Optimization

- [ ] Implement code splitting
- [ ] Optimize asset loading
- [ ] Add progressive enhancement
- [ ] Set up error boundary handling
- [ ] Implement analytics
- [ ] Create production build pipeline

**Testing Checklist:**

- [ ] Test page load times
- [ ] Test performance on low-end devices
- [ ] Test offline capabilities
- [ ] Test error recovery scenarios
- [ ] Verify analytics tracking
- [ ] Test production build integrity

Remember to wait for explicit instructions to proceed to the next phase. Each phase should be fully tested and marked complete before moving forward.
