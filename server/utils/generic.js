const BN = require('bn.js')
const fs = require('fs')

const ipfsCid0ToNftID = (cidV0Str) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const CID = require('cids');
  const cid = new CID(cidV0Str);
  const hashHex = Buffer.from(cid.multihash.slice(2)).toString('hex');
  const hashBN = new BN(hashHex, 16);
  return '0x' + hashBN.toString('hex');
}

const writeFile = (path, data, opts = 'utf8') =>
new Promise((resolve, reject) => {
  fs.writeFile(path, data, opts, (err) => {
    if (err) reject(err)
    else resolve()
  })
})

module.exports = {
  ipfsCid0ToNftID,
  writeFile
}