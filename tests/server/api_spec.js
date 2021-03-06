const fs = require('fs');
const frisby = require('frisby');
const path = require('path');
const Joi = frisby.Joi;
const dal = require('../../src/server/repository/Repository');

const URL = `http://localhost:${process.env.SERVER_PORT}/api/episodes`;
const DATA_DIR = process.env.DATA;

function createFakeEpisode(done) {
  Promise.all([
    dal.add(
      {id: "1111-2222", name: "Breaking Bad", code: "S01E01", score: 8}
    ),
    dal.add(
      {id: "1111-3333", name: "Lethal Weapon", code: "S01E01", score: 7}
    )
  ]).then(() => {
    done();
  });
}

function deleteFakeEpisode(done) {
  fs.readdir(DATA_DIR, (err, files) => {
    if (err) {
      done();
      throw err
    }
    for (const file of files) {
      fs.unlink(path.join(DATA_DIR, file), err => {
        if (err) {
          done();
          throw err
        };
      });
      done();
    }
  });
}

////Methode Post
describe('Add an episode', () => {
  let id;
  it('should make an http request', (done) => {
    frisby.post(`${URL}/`, {
        name: "Blindspot",
        code: "S03E02",
        score: 5
      })
      .expect('status', 201)
      .expect('jsonTypes', {
        'id': Joi.string().required(),
        'name': Joi.string().required(),
        'code': Joi.string().required(),
        'score': Joi.number().required()
      }).then((res) => {
        id = res.body.id;
      })
      .done(done);
  });

  it ('should have file in data', (done) => {
      fs.stat(path.join(DATA_DIR, `${id}.json`), (err, stats) => {
        if (err  || !stats.isFile()) {
          fail();
        }
        done();
      });
  });

  afterAll((done) => {
    deleteFakeEpisode(done)
  })

});



////Methode Get All
describe('See all episodes',() =>{
  beforeAll((done) =>{
      createFakeEpisode(done);
  });
  it('should make an http request', (done) =>{
    frisby.get(`${URL}/`)
        .expect('status',200)
        .expect('jsonTypes','*',{
          'id': Joi.string().required(),
          'name': Joi.string().required(),
          'code': Joi.string().required(),
          'score': Joi.number().required()
    })
        .then((res) => {
          let datas =res.body;

          expect(datas.length).toEqual(2);
          expect(datas).toEqual(jasmine.any(Array));
        })
        .done(done);
  });
  afterAll((done) => {
    deleteFakeEpisode(done);
  })
});


////Methode Get+
describe('See one episode', () => {
  beforeAll((done) => {
    createFakeEpisode(done);
  });
  it('should make an http request', (done) => {
    frisby.get(`${URL}/1111-2222`)
        .expect('status', 200)
        .expect('jsonTypes',{
          'id': Joi.string().required(),
          'name': Joi.string().required(),
          'code': Joi.string().required(),
          'score': Joi.number().required()
        })
        .then((res)=>{

          let data = res.body;

          expect(data.id).toEqual("1111-2222");
          expect(data.name).toEqual("Breaking Bad");
        })
        .done(done);
    afterAll((done)=> {
      deleteFakeEpisode(done);
    })
  })
});


///Methode Put
describe('Modifi an episode', () => {
  beforeAll((done) => {
    createFakeEpisode(done);
  });
  it('should make an http request', (done) => {
    frisby.put(`${URL}/1111-2222`,{
      name: "Blindspot",
      code: "S03E02",
      score: 5
    })
        .expect('status', 200)
        .expect('jsonTypes',{
          'id': Joi.string().required(),
          'name': Joi.string().required(),
          'code': Joi.string().required(),
          'score': Joi.number().required()
        })
        .then((res)=>{

          let data = res.body;

          expect(data.id).toEqual("1111-2222");
          expect(data.name).toEqual("Blindspot");
          expect(data.code).toEqual("S03E02");
          expect(data.score).toEqual(5);
        })
        .done(done);
    afterAll((done)=> {
      deleteFakeEpisode(done);
    })
  })
});