const express = require("express");
const app = express();
const allCities = require("cities15000-json");

const port = 3750;

function getDropName(name, adminCode, country) {
  if (country === "US") return `${name}, ${adminCode} (${country})`;
  return `${name} (${country})`;
}

function getShortArray() {
  return allCities
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
      } else if (cityB.dropname.toLowerCase() < cityA.dropname.toLowerCase()) {
        return +1;
      } else {
        return 0;
      }
    });
}

app.use("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  next();
});

app.get("/id", (req, res) => {
  const shortArray = getShortArray();
  const { id = "" } = req.query;
  if (id.length > 0) {
    const returnValue = shortArray.find((city) => city.key === id);
    return res.status(200).json(returnValue);
  }
  return res
    .status(500)
    .json({ error: { message: "The id you provided does not exist." } });
});

app.get("/place", (req, res) => {
  const shortArray = getShortArray();
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

app.all("*", (req, res) => {
  return res
    .status(404)
    .json({ error: { message: "The endpoint does not exist" } });
});

app.listen(port, () => {
  console.log(`Places-API listening on port ${port} ...`);
});
