const User = require("../../models/user")
const Dataconsumption = require( '../../models/dataconsumption');
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDataCTestDB",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    },() => done());
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
  });

  describe('admin mobile test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";
    test("GET /api/datas", async ()=>{
        const datacon = await Dataconsumption.create({
            day : 1,
            dc : 50
        })

        await supertest(app)
        .get("/api/datas") 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
        })
    })

    test("POST /api/data/create" ,async ()=>{
        const body ={
            day : 2,
            dc : 50
        }
        await supertest(app)
        .post("/api/data/create") 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(200)
        .then(async (response) => {
            // console.log(response.body)
            expect(response.body.newdataconsumption._id).toBeTruthy();
            expect(response.body.newdataconsumption.dc).toBe(body.dc)
            expect(response.body.newdataconsumption.day).toBe(body.day)
        })
    })


    test("GET /api/data/:dataid", async ()=>{
        const datacon = await Dataconsumption.create({
            day : 1,
            dc : 50
        })
        await supertest(app)
        .get("/api/data/"+ datacon._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
            expect(response.body.day).toBe(datacon.day);
            expect(response.body.dc).toBe(datacon.dc);
        })

    })
    test("GET /api/data/:dataid", async ()=>{
        const datacon = await Dataconsumption.create({
            day : 1,
            dc : 50
        })
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayur@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        await supertest(app)
        .get("/api/data/"+ user._id) 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(400)
        .then(async (response) => {
           
        })

    })
   
  })