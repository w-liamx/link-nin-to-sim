// Generates random strings
export const random = (length = 8) => {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characters randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

// Returns a Backend response object
export const responseObject = (
  response,
  statusCode,
  statusState,
  data,
  message
) => {
  if (statusState === "error" || (statusState === "success" && !data))
    response.status(statusCode).json({
      status: statusState,
      message: message,
    });
  if (statusState === "success" && data)
    response.status(statusCode).json({
      status: statusState,
      data: data,
    });
};
