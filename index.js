const HKO        = require("./HKO.js");

if (!process.env.DB_HOST) {
    console.error("process.env.DB_HOST is not defined. exiting");
    process.exit();
}

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
});

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
    
    // console.log(kp);
    
    const sql = `INSERT INTO solar_weather (time, air_temperature, wind_speed, wind_direction, air_pressure, solar_global, solar_direct, solar_diffuse) VALUES ('${time}', ${kp.airTemperature}, ${kp.windSpeed}, ${getWindDirection(kp.windDirection)}, ${hko.seaLevelPressure}, ${kp.globalSolar}, ${kp.directSolar}, ${kp.diffuseSolar})`;
    
    // console.log(sql);
    
    connection.connect();

    connection.query(sql, function (error) { console.log(error.sqlMessage); });

    connection.end();
    
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