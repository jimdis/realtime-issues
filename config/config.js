const WH_URL_DEV = 'https://caa8f02a.ngrok.io/api'
const WH_URL_PROD = 'https://cscloud417.lnu.se/api'

const OAUTH_URL_DEV = 'http://localhost:3000/auth/callback'
const OAUTH_URL_PROD = 'https://cscloud417.lnu.se/auth/callback'

const production = process.env.NODE_ENV === 'production'

module.exports = {
  webHookURL: production ? WH_URL_PROD : WH_URL_DEV,
  redirect_uri: production ? OAUTH_URL_PROD : OAUTH_URL_DEV
}
