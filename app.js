import express from "express";
import Amadeus from "amadeus";
import bodyParser from "body-parser"
import cors from "cors"
import 'dotenv/config'
import fetch from 'node-fetch'


const clientIdNow = process.env.CLIENT_ID;
const clientSecretNow = process.env.CLIENT_SECRET;
const weatherSecret = process.env.WEATHER;

const amadeus = new Amadeus({
  clientId: clientIdNow,
  clientSecret: clientSecretNow,
});

const app = express();
const PORT = 5000;

app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get(`/flight-destination-search`, (req, res) => {
    const originCode = req.query.originCode;
    const durationCode = req.query.duration;
    const dateOfDeparture = req.query.dateOfDeparture;
    const maximumPrice = req.query.maxPrice;
    
    // Find the cheapest flights
    amadeus.shopping.flightDestinations.get({
        origin: originCode,
        duration: durationCode,
        departureDate: dateOfDeparture,
        nonStop: true,
        maxPrice: maximumPrice
    }).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response);
    });
    });
    
app.get(`/weather-search`, (req, res) => {
    const city = req.query.destCity;
    let urlNow = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + weatherSecret
    fetch(urlNow)
    .then(async function (response) {
        const resp = await response.json()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);    
    }, (err) => next(err))
    .catch((err) => next(err));
  })   

app.get(`/weather-search-2`, (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    let urlNow = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + weatherSecret
    fetch(urlNow)
    .then(async function (response) {
        const resp = await response.json()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);    
    }, (err) => next(err))
    .catch((err) => next(err));
  })   
   

app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}`));
