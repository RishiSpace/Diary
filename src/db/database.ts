import { Account, DiaryEntry } from "../types";

const ACCOUNTS_KEY = "diary_accounts";
const ENTRIES_KEY = "diary_entries";

export async function getAccounts(): Promise<Account[]> {
  const res = await fetch('http://localhost:4000/api/accounts');
  const data = await res.json();
  // Parse publicKey/privateKey from JSON strings
  return data.map((a: any) => ({
    ...a,
    publicKey: JSON.parse(a.publicKey),
    privateKey: JSON.parse(a.privateKey),
  }));
}

export async function addAccount(account: Account) {
  await fetch('http://localhost:4000/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
}

export async function getEntries(accountId: string): Promise<DiaryEntry[]> {
  const res = await fetch(`http://localhost:4000/api/entries/${accountId}`);
  return await res.json();
}

export async function addEntry(entry: DiaryEntry) {
  await fetch('http://localhost:4000/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
}

export async function deleteEntry(entryId: string) {
  await fetch(`http://localhost:4000/api/entries/${entryId}`, {
    method: 'DELETE',
  });
}