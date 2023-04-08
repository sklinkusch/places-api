const express = require("express");
const app = express();
const allCities = require("cities15000-json");

const port = 3750;

function getDropName(name, adminCode, country) {
  if (country === "US") return `${name}, ${adminCode} (${country})`;
  return `${name} (${country})`;
}

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  const shortArray = allCities
    .filter((city) => city.population >= 25000)
    .map((city) => {
      const { id, name, lat, lon, country, adminCode } = city;
      const newCity = {
        key: id,
        name,
        lat,
        lng: lon,
        country,
        adminCode,
        dropname: getDropName(name, adminCode, country)
      };
      return newCity;
    })
    .sort((cityA, cityB) => {
      if (cityA.dropname.toLowerCase() < cityB.dropname.toLowerCase()) {
        return -1;
      } else if (cityA.dropname.toLowerCase() > cityB.dropname.toLowerCase()) {
        return +1;
      } else {
        return 0;
      }
    });
  const { input = "" } = req.query;
  const returnArray = shortArray.filter((city) =>
    city.name.toLowerCase().includes(input.toLowerCase())
  );
  if (input.length > 0) {
    return res.status(200).json(returnArray);
  } else {
    return res.status(200).json(shortArray);
  }
});

app.listen(port, () => {
  console.log(`Places-API listening on port ${port} ...`);
});
