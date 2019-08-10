const express = require("express");
const app = express();
const Datastore = require("nedb");
const fetch = require("node-fetch");
require('dotenv').config();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
})
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb"
  })
);
const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

//dataDo  - Just do something with database

app.get("/dataFind", (request, response) => {
  try {
    //let foundDoc;
    console.log("I got a dataFind request");
    database.find({}, (err, data) => {
      if (err) {
        response.end();
        return;
      }
      response.json(data);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/dataUrlChange", (request, response) => {
  try {
    //let foundDoc;
    console.log("I got a dataChange request");
    database.find({}, (err, data) => {
      if (err) {
        response.end();
        return;
      }
      response.json(data);
    });
  } catch (error) {
    console.log(error);
  }
});


//app.post("/wikipic", async (request, response) => {
//  console.log("I got a multi  request!");
//  const data = request.body;
//  console.log(data);

//  fetch(data.urlWikiPic)
//    .catch(err => console.error(err))
//    .then(res => res.text())
//    .then(body => {
//      //console.log(body, "body in wikipic");
//      const results = useData(body);

//      const info = addInfoToDb({
//        results,
//        data
//      });

//     response.json({
//       results,
//      info,
//     status: "success"
//   });
//  })
//   .catch(err => console.error(err));
//});

const sum = function (a, b) {
  return a + b;
}
module.exports = sum;