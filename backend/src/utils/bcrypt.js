import cryptoJs from "crypto-js";

export const generate = (password) =>
  cryptoJs.AES.encrypt(password, process.env.JWT_SECRETKEY).toString();

export const check = (hashedPassword, password) => {
  const decryptedPassword = cryptoJs.AES.decrypt(
    hashedPassword,
    process.env.JWT_SECRETKEY
  );
  const originalPassword = decryptedPassword.toString(cryptoJs.enc.Utf8);
  return originalPassword === password;
};
