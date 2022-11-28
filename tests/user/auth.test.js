const User = require("../../models/user")
const Card = require("../../models/paymentcards")
const Product = require("../../models/product")
const Category = require("../../models/category")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestAuthTestDB",
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

describe('admin user test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";
    test("POST api/googlesignin", async () => {
        
      const user = {
        _id : "122344494",
        name : "mayur",
        email : "mayurpatil@gmail.com",
        role : 0
      }  
      await supertest(app)
        .post("/api/googlesignin")
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(user)
        .expect(200)
        .then((response) => {
          // Check type and length
          expect(response.body).toBeTruthy();
          expect(response.body.user.name).toBe(user.name);
          expect(response.body.user.email).toBe(user.email);
          expect(response.body.user.role).toBe(user.role);
        })
      })

    //////////////////////Authentication Failed Checkkk///////////////////


    test("POST /api/category/create/:userId", async () => {
        const user =  await User.create({ 
              _id: "12345677", 
              name : "mg",
              lastname : "ji",
              email : "mgji391@gmail.com",
              googleId : "12345677",
              role:1
            });
            const data = { name : "Mobiles" };
            //const header = {'Authorization': `Bearer `+ token, 'Content-Type': 'application/json'};
          
            await supertest(app)
              .post("/api/category/create/" + user._id) 
              // .set('Content-Type','application/json') 
              .set('Authorization',"Bearer "+ token)
              .set('Accept', 'application/json')
              .send(data)
              .expect(403)
              .then(async (response) => {
                  
              })
          });
})