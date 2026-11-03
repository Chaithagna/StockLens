import mongoose from 'mongoose';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongodProcess = null;

const findMongodExecutable = () => {
  const commonPaths = [
    'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
  ];

  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
};

const tryLaunchLocalMongod = async () => {
  const exe = findMongodExecutable();
  if (!exe) return false;

  const dataDir = path.resolve(__dirname, '../../data/db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`[Database] Starting local MongoDB instance from: ${exe}`);
  console.log(`[Database] Using storage directory: ${dataDir}`);

  mongodProcess = spawn(exe, ['--dbpath', dataDir, '--port', '27017', '--bind_ip', '127.0.0.1'], {
    stdio: 'ignore',
    detached: true,
  });

  mongodProcess.unref();

  // Wait 2 seconds for socket bind
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return true;
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stocklens';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Initial MongoDB connection failed: ${err.message}`);
    console.log(`[Database] Attempting to auto-start local mongod engine...`);

    const started = await tryLaunchLocalMongod();
    if (started) {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] MongoDB Auto-Launched and Connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (retryErr) {
        console.error(`[Database] Re-connection failed after launch: ${retryErr.message}`);
      }
    }

    // Secondary fallback: In-Memory MongoDB Server with localized config to avoid parent folder traverse
    try {
      process.env.MONGOMS_DOWNLOAD_DIR = path.resolve(__dirname, '../../data');
      process.env.MONGOMS_DISABLE_POSTINSTALL = '1';
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const memServer = await MongoMemoryServer.create();
      const memUri = memServer.getUri();
      console.log(`[Database] In-Memory MongoDB created at: ${memUri}`);
      const conn = await mongoose.connect(memUri);
      return conn;
    } catch (memErr) {
      console.error(`[Database] Critical: Could not connect to any MongoDB instance.`);
      throw err;
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodProcess && !mongodProcess.killed) {
      mongodProcess.kill();
      console.log(`[Database] Local mongod process terminated.`);
    }
  } catch (error) {
    console.error(`[Database] Error during disconnect:`, error);
  }
};
