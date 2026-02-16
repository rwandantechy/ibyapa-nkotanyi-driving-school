export const checkTokenExpiry = (tokenExp) => {
    const expirationTimestamp = tokenExp * 1000;
    const currentTimestamp = Date.now();
    const isExpired = expirationTimestamp < currentTimestamp;
    if (isExpired) {
      return true;
    } else {
      return false;
    }
  };
  