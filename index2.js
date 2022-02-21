const HKO        = require("./HKO.js");

HKO.getWeather().then(weather => {
    // Moment is created with correct timezone information for Hong Kong.
    // Therefore the underlying JS date type represents the correct instant in time.
    // It is being formatted here by node in the server timezone (UTC).
    // The MySQL server also uses SYSTEM timezone by default (UTC).
    // The `time` column is a TIMESTAMP type meaning it holds an instant in time.
    // This means the correct instant in time is stored in the database.
    // To view the time in a local (Hong Kong) timezone, set the correct timezone on 
    // the connection when retrieving the data from the server.
    const time = weather.date.format("YYYY-MM-DD HH:mm:ss");
    const kp = weather.stations["King's Park"];
    const hko = weather.stations["HK Observatory"];
    
    console.log(kp);
    
    
}).catch(e => console.log(e));

const DIRECTIONS = {
    "North": 0,
    "Northeast": 45,
    "East": 90,
    "SouthEast": 135,
    "South": 180,
    "Southwest": 225,
    "West": 270,
    "Northwest": 315,
};

function getWindDirection (direction) {
    return DIRECTIONS[direction];
}