exports.errHandler = (err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    err: err.message,
  });
};
