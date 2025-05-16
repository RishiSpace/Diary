# Personal Diary App

## Overview
A modern, secure diary application built with React, Vite, and TypeScript. Users can create, edit, and manage encrypted diary entries, with each entry tied to a user account. The app features a VSCode-inspired UI, dynamic theme switching, and strong privacy using RSA encryption. Data is stored in a local SQLite database via a Node.js/Express backend.

## Features
- User account management (register/login)
- Create, edit, and view diary entries
- All entries are encrypted with RSA
- VSCode-like split UI: notes list on the left, editor on the right
- Dynamic dark/light theme switching
- Multi-user support

## Technologies Used
- React + TypeScript (frontend)
- Vite (build tool)
- Node.js + Express (backend API)
- SQLite (database)
- RSA encryption (WebCrypto API)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/personal-diary-app.git
   cd personal-diary-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server (runs on port 4000):
   ```sh
   node server.js
   ```
4. In a new terminal, start the frontend dev server:
   ```sh
   npm run dev
   ```
5. Open your browser at [http://localhost:3000](http://localhost:3000)

### Usage
- Register a new account or log in with an existing account.
- Create and edit diary entries. Entries are encrypted and only visible to the logged-in user.
- Switch between dark and light themes using the theme switcher.

### Building for Production
To build the frontend for production:
```sh
npm run build
```

## License
MIT