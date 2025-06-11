const express = require('express');
const authMiddleWare = require('../middlewares/auth')


const fs = require("fs");
const upload = require("../config/multer.config");
const storage = require("../config/appwrite.config");
const { ID } = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");
const fileModel = require('../models/file.models')



const router = express.Router();

router.get('/home',authMiddleWare,async (req,res)=>{
  const userFiles = await fileModel.find({
    user: req.user.userId
  })
    res.render('home',{
      files:userFiles
    })
})




router.post("/upload", authMiddleWare, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Create InputFile object
    const inputFile = InputFile.fromPath(req.file.path, req.file.originalname);

    // Upload to Appwrite
    const uploadedFile = await storage.createFile(
      process.env.BUCKET_ID,
      ID.unique(),
      inputFile
    );

    // Save to MongoDB
    const newFile = await fileModel.create({
      path: req.file.path,
      originalname: req.file.originalname,
      user: req.user.userId,
      fileId: uploadedFile.$id // ✅ storing Appwrite fileId
    });

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

  res.redirect('/home')

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload failed." });
  }
});



router.get('/download/:fileId',authMiddleWare, async(req,res)=>{

  const loggedInUserId = req.user.userId;
  const fileId = req.params.fileId;

  const file = await fileModel.findOne({
    user:loggedInUserId,
    fileId: fileId
  })

  

  if(!file){
    return res.status(401).json({
      message: 'Unautherized'
    })
  }


   try {

   // ✅ Get the readable stream
   const downloadUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${process.env.BUCKET_ID}/files/${fileId}/download?project=${process.env.PROJECT_ID}`;


   res.redirect(downloadUrl);
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ message: 'Download failed' });
  }
})




module.exports = router;