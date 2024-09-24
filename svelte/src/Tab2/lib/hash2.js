async function hash(str) {
    const hash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
}

export default hash;
//   createHash("widi")
//     .then(hash => console.log(`SHA-256 hash: ${hash}`));