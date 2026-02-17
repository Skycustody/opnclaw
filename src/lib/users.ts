import os from "os";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";

export type User = {
  email: string;
  passwordHash: string;
  createdAt: string;
  tenantId: string;
};

function getUsersDbPath(): string {
  const custom = process.env.USERS_DB_PATH;
  if (custom && custom.length > 0) return custom;
  return path.join(os.homedir(), ".openclaw-ui", "users.json");
}

async function readUsersDb(): Promise<Record<string, User>> {
  const dbPath = getUsersDbPath();
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeUsersDb(users: Record<string, User>): Promise<void> {
  const dbPath = getUsersDbPath();
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2), "utf8");
}

export async function createUser(
  email: string,
  password: string,
): Promise<User> {
  const users = await readUsersDb();
  const normalizedEmail = email.toLowerCase().trim();

  if (users[normalizedEmail]) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const tenantId = normalizedEmail
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const user: User = {
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
    tenantId,
  };

  users[normalizedEmail] = user;
  await writeUsersDb(users);
  return user;
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<User | null> {
  const users = await readUsersDb();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users[normalizedEmail];

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readUsersDb();
  const normalizedEmail = email.toLowerCase().trim();
  return users[normalizedEmail] ?? null;
}
