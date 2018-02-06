/**
 * Created by emlouradou on 23/01/18.
 */
const config = require('../config.js');
const fs = require('fs');

class Repository {
    constructor() {

    }
    //READ FILE
    readF(path){
      return new Promise((resolve, reject) => {
        //read file at path
        fs.readFile(config.data+'/'+path, 'utf8', (error, data) => {
          if(error){
            reject(error);
            return;
          }
           var dataFile = JSON.parse(data);
          if(dataFile != "undefined") resolve(dataFile);
          else reject(null);
        });
      });
    }

    //WRITE FILE
    writeF(path, data) {
        return new Promise((resolve, reject) => {
          //write file at path
           fs.writeFile(config.data +'/'+ path, JSON.stringify(data), (error) => {
               if (error) {
                   reject(error);
                   return;
               }
               resolve(data);
           });
        });
    }

    //DELETE FILE
    deleteF(path){
      return new Promise((resolve, reject) => {
        var filePath = config.data + '/' + path;
        //check the existence of the file
        fs.stat(filePath, (error, file) => {
          if (error) {
            reject(error);
            return;
          }
          if(file) {
            //suppression of the file
            fs.unlink(path, (error) => {
              if (error) reject(error);
            });
            resolve();
          }
        });
      });
    }

    //GET all episode action
    findAll() {
      return new Promise((resolve, reject) => {
        fs.readdir(config.data, (error, listFiles) => {
          if (error) {
            reject(error);
            return;
          }
          Promise.all(listFiles.map((file) => {
            //call readFile function
            return this.readF(file);
          })).then((listEpisodes) => {
            resolve(listEpisodes);
          });
        });
      });
    }

    //GET episode action
    findBy(id){
      //call readFile function
      return this.readF(`${id}.json`);
    }

    //POST episode action
    add(object) {
      return new Promise((resolve, reject) => {
        //id creation
        fs.writeFile(config.data+'/'+object.id+".json", JSON.stringify(object), function(err){
          if(err){
              reject(err);
              return;
          }
          resolve(object);
        });
      });
    }

    //PUT action
    edit(id, newData) {
      return new Promise((resolve, reject) => {
        this.findBy(id).then((episode) => {
          if (newData.note != "undefined") { episode.note = newData.note; }
          episode.id = id;
          this.writeF(`${episode.id}.json`, episode).then((episode) => {
            resolve(episode);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      });
    }

    //DELETE episode action
    delete(object){
      //call deleteFile function
      return this.deleteF(`${id}.json`);
    }
}

var repository = new Repository();
module.exports = repository;
