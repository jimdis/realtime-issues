export async function getData (request) {
  let res = await window.fetch(`/api/${request}`)
  res = await res.json()
  return res
}
