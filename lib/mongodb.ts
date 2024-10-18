import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object without using namespace
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache; // This allows mongoose caching on the global object
}

// Initialize or use the cached connection
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // Persist the connection cache globally
  return cached.conn;
}

export default connectToDatabase;
