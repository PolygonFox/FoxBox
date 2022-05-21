
const fastify = require('fastify')({ logger: true })
const { v4: uuid } = require('uuid')
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const fs = require('fs')
const path = require('path')

fastify.register(require('@fastify/secure-session'), {
    // the name of the session cookie, defaults to 'session'
    cookieName: 'foxbox-session',
    // adapt this to point to the directory where secret-key is located
    key: fs.readFileSync(path.join(__dirname, 'secret-key')),
    cookie: {
        path: '/'
        // options for setCookie, see https://github.com/fastify/fastify-cookie
    }
})

fastify.register(require('@fastify/csrf-protection'), { sessionPlugin: '@fastify/secure-session' })

// Spotify connection
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL,
    // accessToken: process.env.ACCESS_TOKEN,
});

fastify.get('/', async (request, reply) => {
    return { playList: appState.playList }
})

fastify.get('/play-song', async (request, reply) => {
    await spotifyApi.addToQueue(request.query.id)
    await spotifyApi.skipToNext()
    return true
})

fastify.get('/search', async (request, reply) => {
    const result = await spotifyApi.searchTracks(request.query.query, {
        limit: 20,
    })

    return result.body.tracks.items
})

fastify.get('/add-example', async (request, reply) => {

    appState.playList = [
        ...appState.playList,
        'lol'
    ]

    spotifyApi.skipToNext()
  .then(function() {
    console.log('Skip to next');
  }, function(err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

    return true
})

// Handle spotify redirect
fastify.get('/redirect', async (request) => {
    const { code, state } = request.query

    if(state !== process.env.ACCESS_TOKEN) {
        return false
    }

    spotifyApi.setAccessToken(code)
    spotifyApi.authorizationCodeGrant(code).then(
        function (data) {
            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        },
        function (err) {
            console.log('Something went wrong!', err);
            return false
        }
    )

    return true
})

// Connect to spotify
fastify.get('/spotify', (req, reply) => {
    const scopes = [
        'streaming'
    ]
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, req.query.state);
    return reply.redirect(303, authorizeURL)
})

// #### FOX BOX ####

// The state is stored in memory :)
const appState = {
    playList: [],
}

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()


console.log('Connect spotify: ', process.env.CONNECT_URL)