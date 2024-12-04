const { BlobServiceClient } = require("@azure/storage-blob");
const config = require("./config");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=https;AccountName=${config.blob.accountName};AccountKey=${config.blob.accountKey};EndpointSuffix=core.windows.net`
);

const containerClient = blobServiceClient.getContainerClient(config.blob.containerName);

// Fonction pour uploader un fichier
async function uploadFileToBlob(fileName, fileContent) {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.upload(fileContent, fileContent.length);
    console.log(`Fichier uploadé avec succès : ${fileName}`);
    return blockBlobClient.url; // URL publique du fichier
  } catch (err) {
    console.error("Erreur lors de l'upload du fichier :", err.message);
    throw err;
  }
}

module.exports = {
  uploadFileToBlob,
};
