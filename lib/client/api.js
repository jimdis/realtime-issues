const apiURI = '/api/'

export async function getData (request) {
  console.log('Getting Data from: ' + request)
  let res = await window.fetch(apiURI + request)
  res = await res.json()
  console.log('Returning Data', res)
  return res
}
