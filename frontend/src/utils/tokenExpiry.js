export const checkTokenExpiry = (tokenExp) => {
  const expirationTimestamp = tokenExp * 1000;
  const currentTimestamp = Date.now();
  const twoDaysFromNow = currentTimestamp + 2 * 24 * 60 * 60 * 1000;
  const isExpiringWithinTwoDays = expirationTimestamp < twoDaysFromNow;
  if (isExpiringWithinTwoDays) {
    return true;
  } else {
    return false;
  }
};
