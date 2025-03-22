const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');
const app = express();
const PORT = process.env.PORT || 3003; // Use environment port for Vercel or fallback to 3003

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function(req, file, cb) {
    cb(null, 'robot-sprites-' + Date.now() + '.zip');
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Accept only zip files
    if (file.mimetype !== 'application/zip' && !file.originalname.endsWith('.zip')) {
      return cb(new Error('Only ZIP files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Middleware for parsing JSON bodies
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle robot image uploads
app.post('/upload-robot-image', (req, res) => {
  try {
    const { filename, dataUrl } = req.body;
    
    // Make sure the images directory exists
    const imagesDir = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Extract the base64 data from the data URL
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Write the file
    fs.writeFileSync(path.join(imagesDir, filename), buffer);
    
    res.status(200).json({ success: true, message: `File ${filename} uploaded successfully` });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file', error: error.message });
  }
});

// Handle ZIP file upload for robot sprites
app.post('/upload-sprites-zip', upload.single('zipFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No ZIP file uploaded' });
    }

    const zipFilePath = req.file.path;
    const imagesDir = path.join(__dirname, 'public', 'images');
    
    // Ensure the images directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Extract the ZIP file
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();
    
    // Filter for robot stage images
    const robotImages = zipEntries.filter(entry => {
      const filename = path.basename(entry.entryName);
      return !entry.isDirectory && /^robot_stage[1-5]\.png$/i.test(filename);
    });
    
    if (robotImages.length === 0) {
      // Clean up the temp zip file
      fs.unlinkSync(zipFilePath);
      return res.status(400).json({
        success: false,
        message: 'No robot stage images found in the ZIP file. Files should be named robot_stage1.png through robot_stage5.png'
      });
    }
    
    // Extract each robot image to the images directory
    robotImages.forEach(entry => {
      const filename = path.basename(entry.entryName);
      const targetPath = path.join(imagesDir, filename.toLowerCase());
      
      // Extract the file
      zip.extractEntryTo(entry, imagesDir, false, true);
      
      // Rename to ensure lowercase filenames
      const extractedPath = path.join(imagesDir, entry.entryName);
      if (extractedPath !== targetPath && fs.existsSync(extractedPath)) {
        fs.renameSync(extractedPath, targetPath);
      }
    });
    
    // Clean up the temp zip file
    fs.unlinkSync(zipFilePath);
    
    res.status(200).json({
      success: true,
      message: `${robotImages.length} robot sprite images extracted successfully`,
      extractedFiles: robotImages.map(entry => path.basename(entry.entryName).toLowerCase())
    });
    
  } catch (error) {
    console.error('Error processing ZIP file:', error);
    
    // Clean up the temp zip file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process ZIP file',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Sweat Pets server running at http://localhost:${PORT}`);
}); 