import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

type MongooseCache = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
};

global.mongoose = cached;

export async function connectToDatabase(): Promise<Connection> {
  // reuse existing connection
  if (cached.conn) {
    return cached.conn;
  }
  // create connection only once
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { maxPoolSize: 10 })
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
