const express = require("express");
const app = express();
const { default: axios } = require("axios");

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, guys" });
});

app.post("/post", async (req, res) => {
  try {
    if (
      req.body.word !== null &&
      req.body.source !== null &&
      req.body.target !== null
    ) {
      let trans = await axios({
        method: "POST",
        url: process.env.API_URL,
        headers: {
          authorization: process.env.API_AUTH_KEY,
        },
        data: {
          providers: "google",
          text: req.body.word, // word you want to translate
          source_language: req.body.source, // source language, its value should be a language code e.g 'en'
          target_language: req.body.target, // target language, its value should be a language code e.g 'es'
        },
      });
      if (trans.data.google.status === "success") {
        res.status(200).json(trans.data.google.text);
      } else {
        res
          .status(500)
          .json({ message: "There is a Problem with your Input!!!" });
      }
    } else {
      res.status(500).json({ message: "Inputs Cannot Be Empty!!!" });
    }
  } catch (err) {
    res.status(500).json({ message: "An Error Occured!!!" });
  }
});

// Global 404 Page
app.use((req, res) => {
  res.status(404).json({ message: "You went the Wrong way!!!" });
});

app.listen(2400, () => console.log("Server started on Port 2400"));
