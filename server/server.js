'use strict'
const express = require('express')
const cors=require('cors')
const databaseHandler = require('./database/databaseHandler')
const app = express()
const PORT = 3002
const HTTP_OK = 200
const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_HTML = 'text/html'

app.use(cors())
app.use(express.static('./Public'));
app.use(express.json());
app.use(express.urlencoded({extended:false})); 

app.get('/allGenre', databaseHandler.getAllGenres)
app.get('/getPlaylists/:genreId', databaseHandler.getPlaylist)
app.post('/addToPlaylist',databaseHandler.addToPlaylist)
app.delete('/deleteFromPlaylist/:trackId',databaseHandler.deleteFromPlaylist)

app.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT)
})