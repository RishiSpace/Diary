import React, { useEffect, useState } from "react";
import { DiaryEntry, Account } from "../types";
import { getEntries, deleteEntry } from "../db/database";
import { decryptWithPrivateKey } from "../encryption/rsa";

export default function DiaryList({ account, onSelect, selectedEntry, onDelete }: {
  account: Account,
  onSelect: (entry: DiaryEntry) => void,
  selectedEntry: DiaryEntry | null,
  onDelete: () => void
}) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [decryptedEntries, setDecryptedEntries] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getEntries(account.id).then((fetchedEntries) => {
      if (!cancelled) setEntries(fetchedEntries);
    });
    return () => { cancelled = true; };
  }, [account, onDelete]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      entries.map((entry) =>
        decryptWithPrivateKey(account.privateKey, entry.content).catch(() => "[Decryption failed]")
      )
    ).then((results) => {
      if (!cancelled) setDecryptedEntries(results);
    });
    return () => { cancelled = true; };
  }, [account, entries]);

  async function handleDelete(e: React.MouseEvent, entryId: string) {
    e.stopPropagation();
    if (window.confirm("Delete this entry?")) {
      await deleteEntry(entryId);
      onDelete();
    }
  }

  return (
    <div className="diary-list sidebar-list">
      <h3>Your Notes</h3>
      <ul>
        {entries.map((entry, idx) => (
          <li
            key={entry.id}
            className={selectedEntry && selectedEntry.id === entry.id ? "selected" : ""}
            onClick={() => onSelect(entry)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{entry.title || "Untitled"}</strong>
              <div className="entry-preview">
                {decryptedEntries[idx]?.slice(0, 30) || "Decrypting..."}
              </div>
              <div style={{ fontSize: "0.8em", color: "#888" }}>{new Date(entry.date).toLocaleDateString()}</div>
            </div>
            <button
              className="delete-entry-btn"
              aria-label="Delete entry"
              title="Delete entry"
              style={{ background: 'none', border: 'none', color: '#e57373', fontSize: '1.2em', marginLeft: 8, cursor: 'pointer' }}
              onClick={e => handleDelete(e, entry.id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}