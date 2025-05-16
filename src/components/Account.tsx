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
    const { publicKey, privateKey } = await generateRSAKeys();
    const account: Account = {
      id: Date.now().toString(),
      username,
      publicKey,
      privateKey,
    };
    await addAccount(account);
    setAccounts(await getAccounts());
    onLogin(account);
  }

  function handleLogin(id: string) {
    const acc = accounts.find((a) => a.id === id);
    if (acc) onLogin(acc);
  }

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
      <button onClick={handleCreate}>Create Account</button>
    </div>
  );
}