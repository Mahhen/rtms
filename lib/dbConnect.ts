// lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGOURI = process.env.MONGOURI;

if (!MONGOURI) {
  throw new Error('Please define the MONGOURI environment variable inside .env.local');
}

// In development, we use a global variable to preserve the connection
// across hot reloads. This prevents creating a new connection on every change.
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log(" Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // This is important for preventing buffering
    };
    
    console.log("🟡 Creating NEW database connection");
    cached.promise = mongoose.connect(MONGOURI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error
    console.error("❌ Database connection failed:", e);
    throw e; // Re-throw the error so the API route fails correctly
  }

  return cached.conn;
}

export default dbConnect;