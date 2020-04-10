const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repoIndex < 0) {
    return response.status(400).end();
  }

  request.repositoryIndex = repoIndex;

  return next();
}

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), likes: 0, title, url, techs };
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request;

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).end();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes += 1;

  response.json(repositories[repositoryIndex]);
});

module.exports = app;
