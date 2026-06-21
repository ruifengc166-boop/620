import crypto from "crypto";

const SCRYPT_PREFIX = "scrypt";
const KEY_LENGTH = 64;

function sha256(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function hashPasswordSecure(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const key = crypto.scryptSync(password, salt, KEY_LENGTH).toString("base64url");
  return `${SCRYPT_PREFIX}$${salt}$${key}`;
}

export function verifyPasswordSecure(storedHash: string, password: string) {
  if (!storedHash) return false;
  if (storedHash.startsWith(`${SCRYPT_PREFIX}$`)) {
    const [, salt, expected] = storedHash.split("$");
    if (!salt || !expected) return false;
    const actual = crypto.scryptSync(password, salt, KEY_LENGTH).toString("base64url");
    const a = Buffer.from(actual);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }
  return storedHash === sha256(password);
}

export function isLegacyPasswordHash(storedHash: string) {
  return !!storedHash && !storedHash.startsWith(`${SCRYPT_PREFIX}$`);
}
