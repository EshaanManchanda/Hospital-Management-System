import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Upload image function
export const uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const file = req.files.image;
    
    // Check file type
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.name).toLowerCase());
    
    if (!mimetype || !extname) {
      return res.status(400).json({ success: false, message: 'Please upload an image file (jpeg, jpg, png, gif)' });
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size should be less than 5MB' });
    }
    
    // Create unique filename
    const fileName = `${uuidv4()}${path.extname(file.name)}`;
    
    // Move file to uploads directory
    const uploadPath = path.join(process.cwd(), 'uploads', fileName);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    file.mv(uploadPath, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
      }
      
      // Return the file path that can be stored in database
      res.status(200).json({ success: true, filePath: `/uploads/${fileName}` });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete image function
export const deleteImage = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    // Prevent directory traversal attacks
    if (fileName.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid file name' });
    }
    
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 