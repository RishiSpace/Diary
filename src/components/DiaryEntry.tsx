import React, { useState, useEffect } from "react";
import { DiaryEntry, Account } from "../types";
import { encryptWithPublicKey } from "../encryption/rsa";
import { addEntry } from "../db/database";

export default function DiaryEntryComponent({ account, onAdd, selectedEntry, onDeselect }: { account: Account; onAdd: () => void; selectedEntry: DiaryEntry | null; onDeselect: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedEntry) {
      (async () => {
        try {
          const { decryptWithPrivateKey } = await import("../encryption/rsa");
          const decrypted = await decryptWithPrivateKey(account.privateKey, selectedEntry.content);
          setContent(decrypted);
          setTitle(selectedEntry.title || "");
        } catch {
          setContent("");
          setTitle("");
        }
      })();
    } else {
      setContent("");
      setTitle("");
    }
  }, [selectedEntry, account]);

  async function handleSave() {
    if (!content.trim() || !title.trim()) return;
    setSaving(true);
    const encrypted = await encryptWithPublicKey(account.publicKey, content);
    const entry: DiaryEntry = {
      id: selectedEntry ? selectedEntry.id : Date.now().toString(),
      accountId: account.id,
      date: selectedEntry ? selectedEntry.date : new Date().toISOString(),
      title,
      content: encrypted,
    };
    try {
      await addEntry(entry);
      setContent("");
      setTitle("");
      onAdd();
      onDeselect();
    } catch (e) {
      alert("Failed to save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="diary-entry main-editor-area">
      <input
        className="themed-input"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={saving}
        maxLength={100}
        style={{ marginBottom: "1rem" }}
      />
      <textarea
        placeholder="Write your diary entry..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={saving}
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleSave} disabled={saving}>{selectedEntry ? "Update Entry" : "Save Entry"}</button>
        {selectedEntry && <button onClick={onDeselect}>New Entry</button>}
      </div>
    </div>
  );
}