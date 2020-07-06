import sodium from "tweetsodium";

// encrypts message string using public key
export function encrypt(message, publicKey) {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    const keyBytes = Buffer.from(publicKey, "base64");

    const encryptedBytes = sodium.seal(messageBytes, keyBytes);

    return Buffer.from(encryptedBytes).toString("base64");
}
