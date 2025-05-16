import React, { useState } from "react";
import AccountComponent from "./components/Account";
import DiaryEntryComponent from "./components/DiaryEntry";
import DiaryList from "./components/DiaryList";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { Account, DiaryEntry } from "./types";
import "./index.css";

export default function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [theme, setTheme] = useState("dark");
  const [refresh, setRefresh] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  // Sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Hide sidebar on desktop, show on mobile if open
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;

  if (!account) {
    return (
      <div className="app-container">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <AccountComponent onLogin={setAccount} />
      </div>
    );
  }

  return (
    <div className="vscode-layout">
      {/* Sidebar toggle button for mobile */}
      {isMobile && (
        <button
          className="sidebar-toggle"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 1001 }}
        >
          ☰
        </button>
      )}
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar${isMobile ? ' mobile' : ''}${sidebarOpen ? ' open' : ''}`}
        style={isMobile ? {
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
          width: '80vw',
          maxWidth: 320,
          boxShadow: sidebarOpen ? '2px 0 8px rgba(0,0,0,0.2)' : undefined,
        } : {}}
      >
        {isMobile && (
          <button
            className="sidebar-toggle-close"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1001 }}
          >
            ✕
          </button>
        )}
        <DiaryList
          account={account}
          onSelect={entry => {
            setSelectedEntry(entry);
            if (isMobile) setSidebarOpen(false);
          }}
          selectedEntry={selectedEntry}
          key={refresh}
          onDelete={() => setRefresh(r => r + 1)}
        />
        <button onClick={() => setAccount(null)}>Logout</button>
      </div>
      {/* Overlay to close sidebar when clicking outside */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.2)',
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="main-editor">
        <h1>Welcome, {account.username}</h1>
        <DiaryEntryComponent
          account={account}
          onAdd={() => setRefresh((r) => r + 1)}
          selectedEntry={selectedEntry}
          onDeselect={() => setSelectedEntry(null)}
        />
      </div>
      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </div>
  );
}