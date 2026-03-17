function errorHandler(err, _req, res, _next) {
  console.error('❌ Error:', err.message);

  // Multer file size / type errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10 MB.' });
  }
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error'
  });
}

module.exports = errorHandler;
