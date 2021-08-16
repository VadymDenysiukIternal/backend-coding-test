export const errorController = (err, res) => {
  const { error_code, message } = err;
  res.status(error_code).json({
    error_code,
    message,
  });
};
