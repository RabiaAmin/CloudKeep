const { Client, Storage, ID } = require("node-appwrite");
const dotenv = require('dotenv')
dotenv.config();
const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.PROJECT_ID)              
  .setKey(process.env.API_KEY);                   

const storage = new Storage(client);


module.exports = storage