const errorHandler = res => res.json({
  message: 'Something went wrong!'
});

const badRequest = (res, err) => {
  res.statusCode = 400;
  return res.json({
    success: false,
    reason: err
  });
};

module.exports = {
  errorHandler,
  badRequest
};
