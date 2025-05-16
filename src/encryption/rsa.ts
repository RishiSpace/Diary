export async function generateRSAKeys() {
  if (
    typeof window === 'undefined' ||
    !window.crypto ||
    !window.crypto.subtle
  ) {
    throw new Error('WebCrypto API is not available. Make sure this code runs in a browser.');
  }
  return window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptWithPublicKey(publicKeyJwk: JsonWebKey, data: string) {
  const publicKey = await window.crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );
  const enc = new TextEncoder().encode(data);
  const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, enc);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptWithPrivateKey(privateKeyJwk: JsonWebKey, encrypted: string) {
  const privateKey = await window.crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"]
  );
  const encryptedBytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encryptedBytes);
  return new TextDecoder().decode(decrypted);
}