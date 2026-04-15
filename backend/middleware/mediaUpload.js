const fs = require('fs');
const multer = require('multer');
const path = require('path');

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.avi'];
const HEADER_BYTES_TO_READ = 64;

const mediaDir = path.join(__dirname, '../uploads/media');
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, `${timestamp}_${safe}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if ([...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS].includes(ext)) {
    cb(null, true);
    return;
  }

  cb(new Error('Only image and video files are allowed'), false);
};

function hasPrefix(buffer, bytes) {
  if (buffer.length < bytes.length) return false;
  return bytes.every((byte, index) => buffer[index] === byte);
}

function hasAsciiAt(buffer, offset, text) {
  if (buffer.length < offset + text.length) return false;
  return buffer.subarray(offset, offset + text.length).toString('ascii') === text;
}

function matchesMediaSignature(buffer, ext) {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return hasPrefix(buffer, [0xff, 0xd8, 0xff]);
    case '.png':
      return hasPrefix(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case '.gif':
      return hasAsciiAt(buffer, 0, 'GIF87a') || hasAsciiAt(buffer, 0, 'GIF89a');
    case '.webp':
      return hasAsciiAt(buffer, 0, 'RIFF') && hasAsciiAt(buffer, 8, 'WEBP');
    case '.webm':
      return hasPrefix(buffer, [0x1a, 0x45, 0xdf, 0xa3]);
    case '.avi':
      return hasAsciiAt(buffer, 0, 'RIFF') && hasAsciiAt(buffer, 8, 'AVI ');
    case '.mp4':
    case '.mov':
      return hasAsciiAt(buffer, 4, 'ftyp');
    default:
      return false;
  }
}

async function readFileHeader(filePath) {
  const handle = await fs.promises.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(HEADER_BYTES_TO_READ);
    const { bytesRead } = await handle.read(buffer, 0, HEADER_BYTES_TO_READ, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

async function removeFileIfPresent(filePath) {
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

async function validateUploadedMedia(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const header = await readFileHeader(file.path);
  return matchesMediaSignature(header, ext);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const mediaUpload = {
  single(fieldName) {
    const middleware = upload.single(fieldName);

    return (req, res, cb) => {
      middleware(req, res, async (err) => {
        if (err || !req.file) {
          cb(err);
          return;
        }

        try {
          const isValid = await validateUploadedMedia(req.file);
          if (!isValid) {
            await removeFileIfPresent(req.file.path);
            req.file = undefined;
            cb(new Error('Uploaded file content does not match the selected media type.'));
            return;
          }

          cb(null);
        } catch (validationError) {
          await removeFileIfPresent(req.file.path);
          req.file = undefined;
          cb(new Error('Failed to validate uploaded media.'));
        }
      });
    };
  },
};

module.exports = mediaUpload;
