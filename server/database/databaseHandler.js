const {Pool}=require('pg');

const PG_HOST = 'localhost';
const PG_PORT = 5432;
const PG_DATABASE = 'final-project-music-albums';
const PG_USER = 'postgres';
const PG_PASSWORD = '1';
const STATUS_OK = 200;
let playlist_id=0;

const pool = new Pool({
    host : PG_HOST,
    port : PG_PORT,
    database : PG_DATABASE,
    user : PG_USER,
    password : PG_PASSWORD
});

function getAllGenres(request, response) {//return all the datat from playlist table
    pool.query('SELECT * FROM playlist', function (error, results, fields) {
      if (error) throw error;
      response.send(results)
    });  
}
function addToPlaylist(request, response) {//adding a song to tarck tables

        pool.query("SELECT id FROM playlist where title=$1",[request.body.genre[0]], function (error, results, fields) {//fetches id from playlist table of specific song
            if (error) throw error;
            response.send(results)
            console.log(typeof results.rows[0])
            if(typeof results.rows[0] !== "undefined")
            {
                playlist_id=results.rows[0].id

                let alreadyExistCount=0;
                    pool.query('SELECT title FROM track', function (error, results, fields) {//selects title from track to atch to current title if it already exists
                    if (error) throw error;
                    let tracks=results.rows
                    tracks.map(track=>{
                        if (request.body.title === track.title)//chechking if track title of cuurent track is already present in the table
                        {
                            alreadyExistCount++;
                        }
                    })
                    
                    if(alreadyExistCount===0)//inserts only when track doesn't exist in the table
                    {
                        pool.query("INSERT INTO track (playlist_id, title, uri, master_id, image, format, country)VALUES ($1, $2, $3, $4, $5, $6, $7)",[playlist_id, request.body.title, request.body.uri, request.body.master_id, request.body.thumb, request.body.format, request.body.country], function (error, results, fields) {
                            if (error) throw error;
                        });
                    }
                });
            }
        });
}
function getPlaylist(request, response) {//returns tracks which match the genre Id
    let genreId = request.params.genreId;
    pool.query('SELECT * FROM track where playlist_id=$1',[genreId], function (error, results, fields) {
        if (error) throw error;
        response.send(results)
      }); 
}
function deleteFromPlaylist(request, response) {//deletes from table track of particular id
    const trackId = parseInt(request.params.trackId)
    pool.query('Delete FROM track where id=$1',[trackId], function (error, results, fields) {
        if (error) throw error;
        response.send(results)
      }); 
}
module.exports={
    getAllGenres,
    addToPlaylist,
    getPlaylist,
    deleteFromPlaylist
}