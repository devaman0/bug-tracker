module.exports = (err, req, res, next) => {
  console.error(err.stack);

  const status = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(status).json({
    message: err.message || "Server error",
  });
};
