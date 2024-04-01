'use strict';

const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('../configs/cloudinary.config');

const uploadRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER,
  },
});

const upload = multer({ storage });

uploadRouter.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  return res.status(200).json({
    status: 'success',
    image: req.file.path,
  });
});

uploadRouter.delete('/:publicId', async (req, res) => {
  return res.status(204).json({
    status: 'success',
    data: await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_FOLDER}/${req.params.publicId}`,
    ),
  });
});

module.exports = uploadRouter;
