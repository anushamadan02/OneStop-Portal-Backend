const User = require("../../models/user")
const Card = require("../../models/paymentcards")
const Product = require("../../models/product")
const {Order,ProductCart} = require("../../models/order")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestUTestDB",
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
    test("GET api/users", async () => {
      const post = await User.create(
        { 
          _id: "115560636549278411291",
          name : "mayur",
          lastname : "mayur",
          email : "mayurpatil@gmail.com",
          googleId : "115560636549278411291",
          role : 1
        });
    
      await supertest(app)
        .get("/api/users")
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          // Check type and length
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toEqual(1);
    
          // Check data
          expect(response.body[0]._id).toBe(post.id);
        })
    })
    test("GET api/user/:userId", async () => {
        const post = await User.create(
          { 
            _id: "115560636549278411291",
            name : "mayur",
            lastname : "mayur",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            role : 1
          });
      
        await supertest(app)
          .get("/api/user/" + post._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then((response) => {
            // Check type and length
            expect(response.body).toBeTruthy()
            expect(response.body.googleId).toBe(post.googleId)
          })
    })
    test("GET api/user/:userId", async () => {
          const post = await User.create(
            { 
              _id: "115560636549278411291",
              name : "mayur",
              lastname : "mayur",
              email : "mayurpatil@gmail.com",
              googleId : "115560636549278411291",
              role : 1
            });
        
          await supertest(app)
            .get("/api/user/" + "12ab")
            .set('Authorization',"Bearer "+ token)
            .set('Accept', 'application/json')
            .expect(400)
            .then((response) => {
              // Check type and length
            })
    })
    
    test("PUT api/user/:userId", async () => {
      const post = await User.create(
        { 
          _id: "115560636549278411291",
          name : "mayur",
          lastname : "mayur",
          email : "mayurpatil@gmail.com",
          googleId : "115560636549278411291",
          role : 1
        });
        const body = {
          email : "mayurp@gmail.com"
        }
          await supertest(app)
           .put("/api/user/"+post._id)
           .set('Authorization',"Bearer "+ token)
           .set('Accept', 'application/json')
           .send(body)
           .expect(200)
           .then((response) => {
             // Check type and length
             expect(response.body).toBeTruthy();
             expect(response.body.email).toBe(body.email);
           })
    })
    test("GET api/orders/user/:userId",async()=>{
      const user =  await User.create({ 
        _id: "115560636549278411291", 
        name : "mg",
        lastname : "ji",
        email : "mgji391@gmail.com",
        googleId : "115560636549278411291",
        role:1
      });
    
       const card = await Card.create({
              userId :"115560636549278411291",
              cardtype : "Credit",
              cardnumber : 123456789122,
              expirydate : "05/21"
         });

        const order = await Order.create({
            status: 'Processing',
            products: [  {
                "_id": "612b83af0cc9fa8cb0f41702",
                "count": 1,
                "name": "Apple Iphone 12",
                "price": 123456
            } ],
            amount: 71999,
            address: 'Melbourne Opposite To Walmart streer 2012',
            user: '115560636549278411291',
            cardId: card._id
          });

         await supertest(app)
          .get("/api/orders/user/" + user._id) 
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Order///////////////////////
            // Check the response
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
          })
       
    })
      ///////////////////////Get Payment Cards//////////////////////////
    test("GET api/paymentcards/:userId",async()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291"
          });
        const card = await Card.create({
            userId : user._id,
            cardtype : "Credit",
            cardnumber : 123456789122,
            expirydate : "05/21"
          });
          await supertest(app).get("/api/paymentcards/"+ user._id)
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
          })
    })
      
    test("POST /api/paymentcards/:userId", async ()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291"
          });
        const card = {
            userId : user._id,
            cardtype : "Credit",
            cardnumber : 123456789122,
            expirydate : "05/21"
          };

          await supertest(app)
          .post("/api/paymentcards/"+ user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(card)
          .expect(200)
          .then(async (response) => {
            expect(response.body).toBeTruthy()
            expect(response.body.userId).toBe(card.userId)
            expect(response.body.cardtype).toBe(card.cardtype)
            expect(response.body.cardnumber).toBe(card.cardnumber)
            expect(response.body.expirydate).toBe(card.expirydate)

            
          })
    })


    test("POST /api/addtocart/:userId", async ()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291"
          });
        const product = await Product.create({
            name: "Iphone 12 Pro max", 
            description: "Iphone description",
            price :  130000,
            stock :  500,
            sold : 0,
            category : "612b813e0cc9fa8cb0f416f7"
        })
        const body = {
          product : product._id,
          quantity : 1
        }
        await supertest(app)
          .post("/api/addtocart/"+ user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
            expect(response.body[0]).toBeTruthy()
            // expect(response.body.product).toBe(body.product)
            expect(response.body[0].quantity).toBe(body.quantity)
          })
    })
    test("GET /api/cart/:userId", async ()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            cart :[{
              product :"612b813e0cc9fa8cb0f416f7",
              quantity : 1
            }]
          });
          await supertest(app)
          .get("/api/cart/"+ user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then(async (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
          })
    })
    test("POST /api/deletefromcart/:userId",async ()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            cart :[{
              product :"612b813e0cc9fa8cb0f416f7",
              quantity : 1
            }]
          });
          const body ={
            id :"612b813e0cc9fa8cb0f416f7"
          }
          await supertest(app)
          .post("/api/deletefromcart/"+ user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
            const res = await User.findById(user._id);
            expect(Array.isArray(res.cart)).toBeTruthy();
            expect(res.cart.length).toEqual(0);
          })
    })
    test("POST /api/updateproductoncart/:userId",async()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            cart :[{
              product :"612b813e0cc9fa8cb0f416f7",
              quantity : 1
            }]
          });
          const body ={
            id :"612b813e0cc9fa8cb0f416f7",
            quantity : 2
          }
          await supertest(app)
          .post("/api/updateproductoncart/"+ user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
            const res = await User.findById(user._id);
            expect(Array.isArray(res.cart)).toBeTruthy();
            expect(res.cart.length).toEqual(1);
            expect(res.cart[0].quantity).toEqual(body.quantity);
          })
            
    })
    test("GET /api/emptycart/:userId",async()=>{
        const user = await User.create(
          { 
            _id: "115560636549278411291", 
            name : "mayur",
            lastname : "patil",
            email : "mayurpatil@gmail.com",
            googleId : "115560636549278411291",
            cart :[{
              product :"612b813e0cc9fa8cb0f416f7",
              quantity : 1
            }]
          });
          await supertest(app)
          .get("/api/emptycart/"+ user._id)
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .expect(200)
          .then(async (response) => {
            const res = await User.findById(user._id);
            expect(Array.isArray(res.cart)).toBeTruthy();
            expect(res.cart.length).toEqual(0);
          })
    })
})