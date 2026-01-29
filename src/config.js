
import 'dotenv/config';

export const config = {
  uri: process.env.AZURE_COSMOS_MONGO_URI,
  dbName: process.env.MONGO_DB_NAME || 'assignment-db',
  port: Number(process.env.PORT || 8080),
  jwtSecret: process.env.JWT_SECRET || 'please-change-me',
  retryWrites: process.env.COSMOS_RETRY_WRITES ? process.env.COSMOS_RETRY_WRITES === 'true' : true,
};
