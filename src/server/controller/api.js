const express = require('express');
const config = require('../config.js');
const fs = require('fs');
const repository = require('../repository/Repository.js')
var router = express.Router();
const uuid = require('node-uuid');

/*
 Method : POST A episode
 Url : /api/episodes
 Description : ajout d'un Episodes
 */
 router.post('/', function (request, response) {
     var episode = request.body;
     if (episode) {
         episode.id = uuid.v4();
         repository.add(episode).then((episode) => {
             response.status(201);
             response.send(episode);
         }).catch((err) => {
             response.sendStatus(500);
         });
     } else {
         response.sendStatus(400);
     }
 });

 /*
  Method : PUT episode
  Url : /api/episodes/:id
  Description : Update d'un Episode
  */
 router.put('/:id', function (request, response) {
     var episode = repository.edit(request.params.id, request.body);
     repository.edit(request.params.id, request.body).then((episode) => {
         response.status(200);
         response.send(episode);
     }).catch((err) => {
         response.sendStatus(500);
     });
 });

 /*
  Method : GET
  Url : /api/episodes
  Description : get la liste des episodes
  */
 router.get('/', function (request, response) {
     repository.findAll().then((episodes) => {
         response.status(200);
         response.send(episodes);
     }).catch((err) => {
         response.sendStatus(500);
     });
 });

 /*
  Method : GET
  Url : /api/episodes/:id
  Description : Get Episode
  */
 router.get('/:id', function (request, response) {
     repository.findBy(request.params.id).then((episode) => {
         response.status(200);
         response.send(episode);
     }).catch((err) => {
         response.sendStatus(500);
     });
 });

 /*
  Method : DELETE
  Url : /api/episodes/:id
  Description : suppression Episode
  */
 router.delete('/:id', function (request, response) {
     repository.delete(request.params.id).then(() => {
         response.sendStatus(204);
     }).catch((err) => {
         response.sendStatus(500);
     });
 });

module.exports = router;
