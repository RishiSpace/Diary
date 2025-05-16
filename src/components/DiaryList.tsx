import React, { useEffect, useState } from "react";
import { DiaryEntry, Account } from "../types";
import { getEntries } from "../db/database";
import { decryptWithPrivateKey } from "../encryption/rsa";

export default function DiaryList({ account, onSelect, selectedEntry }: { account: Account, onSelect: (entry: DiaryEntry) => void, selectedEntry: DiaryEntry | null }) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [decryptedEntries, setDecryptedEntries] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getEntries(account.id).then((fetchedEntries) => {
      if (!cancelled) setEntries(fetchedEntries);
    });
    return () => { cancelled = true; };
  }, [account]);

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

  return (
    <div className="diary-list sidebar-list">
      <h3>Your Notes</h3>
      <ul>
        {entries.map((entry, idx) => (
          <li
            key={entry.id}
            className={selectedEntry && selectedEntry.id === entry.id ? "selected" : ""}
            onClick={() => onSelect(entry)}
          >
            <strong>{new Date(entry.date).toLocaleDateString()}</strong>
            <div className="entry-preview">
              {decryptedEntries[idx]?.slice(0, 30) || "Decrypting..."}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}