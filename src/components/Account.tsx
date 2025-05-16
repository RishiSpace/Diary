import React, { useState, useEffect } from "react";
import { Account } from "../types";
import { generateRSAKeys } from "../encryption/rsa";
import { addAccount, getAccounts } from "../db/database";

export default function AccountComponent({
  onLogin,
}: {
  onLogin: (account: Account) => void;
}) {
  const [username, setUsername] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    getAccounts().then(setAccounts);
  }, []);

  async function handleCreate() {
    if (!username.trim()) return;
    try {
      const { publicKey, privateKey } = await generateRSAKeys();
      // Export keys to JsonWebKey
      const exportedPublicKey = await window.crypto.subtle.exportKey('jwk', publicKey);
      const exportedPrivateKey = await window.crypto.subtle.exportKey('jwk', privateKey);

      const account: Account = {
        id: Date.now().toString(),
        username,
        publicKey: exportedPublicKey,
        privateKey: exportedPrivateKey,
      };
      await addAccount(account);
      setAccounts(await getAccounts());
      onLogin(account);
    } catch (err) {
      alert(
        "Failed to generate keys. Make sure you are running this in a supported browser environment."
      );
      console.error(err);
    }
  }

  function handleLogin(id: string) {
    const acc = accounts.find((a) => a.id === id);
    if (acc) onLogin(acc);
  }

  const cryptoAvailable =
    typeof window !== "undefined" &&
    !!window.crypto &&
    !!window.crypto.subtle;

  return (
    <div className="account-container">
      <h2>Accounts</h2>
      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            {a.username} <button onClick={() => handleLogin(a.id)}>Login</button>
          </li>
        ))}
      </ul>
      <input
        placeholder="New username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="themed-input"
      />
      <button onClick={handleCreate} disabled={!cryptoAvailable}>
        Create Account
      </button>
    </div>
  );
}