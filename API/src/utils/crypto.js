const { createHash } = require("crypto");

const algorithm = process.env.Hash_Algo;

const genHash = (key) => {
  return createHash(algorithm).update(key).digest("base64");
};

module.exports = { genHash };
