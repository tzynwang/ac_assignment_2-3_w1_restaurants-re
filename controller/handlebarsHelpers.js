function isEqual (target1, target2) {
  return target1 === target2
}

function toImage (contentType, buffer) {
  return `data:image${contentType};base64,${buffer.toString('base64')}`
}

function notDEMO (userType) {
  return userType !== 'DEMO'
}

module.exports = { isEqual, toImage, notDEMO }
