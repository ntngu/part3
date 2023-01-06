const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

let people = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(people);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res
      .status(400)
      .json({
        error: "name and/or number missing",
      })
      .end();
  } else if (people.find((person) => person.name === body.name)) {
    return res
      .status(409)
      .json({
        error: "name must be unique",
      })
      .end();
  } else {
    const person = {
      id: Math.floor(Math.random() * 500),
      name: body.name,
      number: body.number,
    };

    people = people.concat(person);
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    people = people.filter((person) => person.id !== id);
    res.json({
      success: "person removed",
    });
  } else {
    res.status(404).json({
      error: "person already removed",
    });
  }
});

app.get("/api/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${people.length} people</p>
    <p>${new Date()}</p>`
  );
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
