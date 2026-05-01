import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const ACCESS_COOKIE_PREFIX = "triovate_agreement_access_";
const WORD_BANK = [
  "amber",
  "apex",
  "atlas",
  "cedar",
  "delta",
  "ember",
  "frost",
  "globe",
  "harbor",
  "mango",
  "nova",
  "onyx",
  "pixel",
  "quartz",
  "ridge",
  "summit",
  "tango",
  "vector",
];

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "triovate-local-agreement-secret";
}

export function generateSecureAgreementSlug() {
  const pick = () => WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  return `${pick()}-${pick()}-${randomBytes(3).toString("hex")}`;
}

export function hashAgreementPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyAgreementPassword(password: string, storedHash?: string | null) {
  if (!storedHash) return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, "hex");
  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

export function getAgreementAccessCookieName(slug: string) {
  return `${ACCESS_COOKIE_PREFIX}${slug}`;
}

export function createAgreementAccessToken(slug: string, passwordHash?: string | null) {
  if (!passwordHash) return "";
  return createHash("sha256")
    .update(`${getSecret()}:${slug}:${passwordHash}`)
    .digest("hex");
}

export function hasAgreementAccessCookieValue(
  cookieValue: string | undefined,
  slug: string,
  passwordHash?: string | null,
) {
  if (!cookieValue || !passwordHash) return false;
  return cookieValue === createAgreementAccessToken(slug, passwordHash);
}
