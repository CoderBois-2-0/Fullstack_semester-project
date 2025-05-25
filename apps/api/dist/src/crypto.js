/**
 * @description
 * hashes a password with the crypto api,
 * Cloudflare does not work well with a lot of hashing libraries so using this for simplicity
 * @param password - The password to hash
 * @returns A hash of the provided password
 */
async function hash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}
/**
 * @description
 * Will verify if two values match when they are both hashed
 * @param attempt - The password to match against the source, will be hashed
 * @param source - The stored password to match the attempt against
 * @returns A true value if the two values match
 */
async function verify(attempt, source) {
    const hashedPassword = await hash(attempt);
    return hashedPassword === source;
}
export { hash, verify };
