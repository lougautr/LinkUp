module.exports = {
  cosmos: {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY,
    databaseId: process.env.COSMOS_DB_DATABASE_ID,
    containerId: process.env.COSMOS_DB_CONTAINER_ID,
  },
  blob: {
    accountName: process.env.BLOB_STORAGE_ACCOUNT_NAME,
    accountKey: process.env.BLOB_STORAGE_ACCOUNT_KEY,
    containerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
};
