// Import required functions
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");
const db = require("./db/db.json");

// Set port and call app
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Note route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API / Note route
app.get("/api/notes", (req, res) => {
  // Reads the db.json file
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Sends db.json
      res.send(data);
    }
  });

  console.info(`${req.method} request received to get notes`);
});

// Adds new note to db.json
app.post("/api/notes", (req, res) => {
  // Log the request to the console
  console.info(`${req.method} request received to add a note`);

  // destructures the request's body
  const { title, text } = req.body;

  // If there is a title and text, read and write db.json
  if (title && text) {
    // Contructs a newNote object
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    // Read the current db.json
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Parse the json file
        const parsedNotes = JSON.parse(data);
        // add the new note to the parsed data
        parsedNotes.push(newNote);

        // Write the file with the new note included
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes!")
        );
      }
    });

    // Create a response object with  the added note in the body
    const response = {
      status: "success",
      body: newNote,
    };

    // Log the response
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in adding note");
  }
});

// Deletes a note from db.json
app.delete("/api/notes/:id", (req, res) => {
  // Logs the request to the console
  console.info(`${req.method} request received to remove a note`)

  console.log(req.params);
  const requestedNote = req.params.id;

  // Reads the db.json file
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.err(err);
    } else {
      const parsedData = JSON.parse(data);

      // Search for the note that the user wants to delete in the database
      console.log(requestedNote);

      // Remove the note the user wants deleted
      let reducedDB = parsedData.filter(function (el) {
        return el.note_id !== requestedNote;
      });
      console.log(reducedDB);

      // Write the file with the deleted note removed
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(reducedDB, null, 4),
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
          } else {
            const response = {
              status: "success",
              body: reducedDB,
            };

            // Log the response
            console.log(response);
            res.status(200).json(response);
          }
        }
      );
    }
  });
});

// Sets server to listen
app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
