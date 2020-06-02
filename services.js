const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/',(req,res) => {
    res.send({ message: 'Enter /suggestions?q=<CITY NAME>&latiude=<LATITUDE>&longitude=<LONGITUDE>. latiude & longitude are optional' })
  })
  
const router = require('./apps.js')
app.use('/suggestions', router)
  
app.get('*', function(req, res){
    res.statusCode = 404
    res.json({ message: 'Error,route not found',statusCode: res.statusCode });
});

// listen for requests
//app.listen(3000, () => {
    //console.log("Server is listening on port 3000");
//});

const server = app.listen(process.env.PORT || 8080, () => {
    const host = server.address().address;
    const port = server.address().port;
});
