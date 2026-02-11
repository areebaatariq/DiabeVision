import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
/** This project uses its own database only. Do not use the DB name from the URI (e.g. scopeshift). */
export const DIABEVISION_DB_NAME = "diabevision";

let client: MongoClient | null = null;

export async function connectDb(): Promise<Db> {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(DIABEVISION_DB_NAME);
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
