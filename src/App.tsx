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

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
      <div className="sidebar">
        <DiaryList account={account} onSelect={setSelectedEntry} selectedEntry={selectedEntry} key={refresh} />
        <button onClick={() => setAccount(null)}>Logout</button>
      </div>
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