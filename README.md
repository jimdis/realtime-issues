# Realtime Issues
A web application for the course 1dv023: [Server-based Web Programming](https://coursepress.lnu.se/kurs/serverbaserad-webbprogrammering/) at Linnaeus University.

### URL: http://cscloud417.lnu.se

## Security

The following security features are implemented:

- Force HTTPS through reverse proxy and certificate through [Let's Encrypt](https://letsencrypt.org).
- Environment variables stored in .env-file for all keys/secrets. Included in .gitignore.
- User authentication using [Github OAuth](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/).
- Server only allows POST requests from Github by [validating payloads](https://developer.github.com/webhooks/securing/). All other POST requests are rejected.
- GET requests from client that try to access Github API use the OAuth token stored in session. When client logs out, the session is destroyed.
- Websocket connections through [socket.io](https://socket.io) are also validated using the OAuth token. When the server receives a POST requests from Github it uses the :ID (username) of the request and sends a private message to a [room](https://socket.io/docs/rooms-and-namespaces/#Rooms) with the same username. This way, the same user can get websocket messages on several clients if logged in, and only messages meant for that user. Other clients will not receive those messages.
- Cookies are set to http only (default), max age 1 day and secure (https only)
- [Helmet](https://github.com/helmetjs/helmet) is used with a rather strict Content Security Policy.

## Used parts

### Reverse Proxy
NGINX is used as a reverse proxy. It handles all requests to cscloud417.lnu.se on ports 80 and 443, upgrades http connections to an https connection between the client and the proxy and then forwards traffic through http to the node server listening on port 3000. Certbot configured the https, but I had to include some configuration to get https cookies to work (by including X-Forwarded-Proto header).

## Process Manager
[PM2](http://pm2.keymetrics.io) is used as a process manager to monitor the application and restart it if it crashes. When pushing updates through git, PM2 restarts the application. I have not used load balancing or anything more advanced, but would try to understand it if I expected more traffic :)

## TLS Certificates
I grabbed a TLS certificate from [Let's encrypt](https://letsencrypt.org) and used the [Certbot](https://certbot.eff.org) to do the installation on the NGINX server. This ensures that clients connect to the app through HTTPS and that the browser does not warn the user about security risks.

## Environment variables

