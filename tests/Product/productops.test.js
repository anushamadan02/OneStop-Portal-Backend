const Product = require("../../models/product")
const Category = require("../../models/category")
const User = require("../../models/user")
const app = require("../../index")
const mongoose = require("mongoose");
const supertest = require("supertest");


beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestTestProdOpsDB",
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

describe('admin product test', () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMTU1NjA2MzY1NDkyNzg0MTEyOTEiLCJpYXQiOjE2MzAzMTk1MzN9.DWAfipzBUOLzO9IssEQw9WDkxB3fOBPWtcIyaIIL0Kk";

    ///////////////////////Testing Create Category////////////////////////
    test("POST api/review/:userId/:productId", async () => {
    const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        });
        const product = await Product.create({ 
            name: "Iphone 12 Pro max", 
            description: "Iphone description",
            price :  130000,
            stock :  500,
            sold : 0,
            category : "612b813e0cc9fa8cb0f416f7"
          });
        
          const body ={
            stars : 4,
            comment : "Awsome"
          }
        await supertest(app)
          .post("/api/review/"+user._id +"/"+product._id)
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Category///////////////////////
            // Check the response
            expect(response.body).toBeTruthy();
            expect(response.body.review[0].stars).toBe(body.stars);
            expect(response.body.review[0].comment).toBe(body.comment);
          })
    })
    test("PATCH api/review/:userId/:productId", async () => {
    const user =  await User.create({ 
          _id: "115560636549278411291", 
          name : "mg",
          lastname : "ji",
          email : "mgji391@gmail.com",
          googleId : "115560636549278411291",
          role:1
        });
        const product = await Product.create({ 
            name: "Iphone 12 Pro max", 
            description: "Iphone description",
            price :  130000,
            stock :  500,
            sold : 0,
            category : "612b813e0cc9fa8cb0f416f7",
            review :[{
                stars : 4,
                comment : "Awsome",
                user :user
                }              
            ]
          });
        
          const body ={
            stars : 5,
            comment : "Awsome1"
          }
        await supertest(app)
          .patch("/api/review/"+user._id +"/"+product._id)
          // .set('Content-Type','application/json') 
          .set('Authorization',"Bearer "+ token)
          .set('Accept', 'application/json')
          .send(body)
          .expect(200)
          .then(async (response) => {
              /////////////////Check For Category///////////////////////
            // Check the response
            expect(response.body).toBeTruthy();
            expect(response.body.review[0].stars).toBe(body.stars);
            expect(response.body.review[0].comment).toBe(body.comment);
          })
    })
    test("DELETE api/review/:userId/:productId", async () => {
        const user =  await User.create({ 
              _id: "115560636549278411291", 
              name : "mg",
              lastname : "ji",
              email : "mgji391@gmail.com",
              googleId : "115560636549278411291",
              role:1
            });
            const product = await Product.create({ 
                name: "Iphone 12 Pro max", 
                description: "Iphone description",
                price :  130000,
                stock :  500,
                sold : 0,
                category : "612b813e0cc9fa8cb0f416f7",
                review :[{
                    stars : 4,
                    comment : "Awsome",
                    user :user
                    }              
                ]
              });
            
            await supertest(app)
              .delete("/api/review/"+user._id +"/"+product._id)
              // .set('Content-Type','application/json') 
              .set('Authorization',"Bearer "+ token)
              .set('Accept', 'application/json')
              .expect(200)
              .then(async (response) => {
                  /////////////////Check For Category///////////////////////
                // Check the response
                expect(response.body).toBeTruthy();
                expect(Array.isArray(response.body.review)).toBeTruthy();
                expect(response.body.review.length).toEqual(0);
              })
    })

    test("POST api/likeproduct/:userId/:productId",async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mg",
            lastname : "ji",
            email : "mgji391@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
          const product = await Product.create({ 
              name: "Iphone 12 Pro max", 
              description: "Iphone description",
              price :  130000,
              stock :  500,
              sold : 0,
              category : "612b813e0cc9fa8cb0f416f7",
              review :[{
                  stars : 4,
                  comment : "Awsome",
                  user :user
                  }              
              ]
            });
            const body= {
                like : 1
            }
          
          await supertest(app)
            .post("/api/likeproduct/"+user._id +"/"+product._id)
            // .set('Content-Type','application/json') 
            .set('Authorization',"Bearer "+ token)
            .set('Accept', 'application/json')
            .send(body)
            .expect(200)
            .then(async (response) => {
                /////////////////Check For Category///////////////////////
              // Check the response
              expect(response.body).toBeTruthy();
              expect(Array.isArray(response.body.like)).toBeTruthy();
              expect(response.body.like.length).toEqual(1);
            })
    })
    test("POST api/likeproduct/:userId/:productId",async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mg",
            lastname : "ji",
            email : "mgji391@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
          const product = await Product.create({ 
              name: "Iphone 12 Pro max", 
              description: "Iphone description",
              price :  130000,
              stock :  500,
              sold : 0,
              category : "612b813e0cc9fa8cb0f416f7",
              review :[{
                  stars : 4,
                  comment : "Awsome",
                  user :user
                  }              
              ],
              like : [user._id]
            });
            const body= {
                like : -1
            }
          
          await supertest(app)
            .post("/api/likeproduct/"+user._id +"/"+product._id)
            // .set('Content-Type','application/json') 
            .set('Authorization',"Bearer "+ token)
            .set('Accept', 'application/json')
            .send(body)
            .expect(200)
            .then(async (response) => {
                /////////////////Check For Category///////////////////////
              // Check the response
              expect(response.body).toBeTruthy();
              expect(Array.isArray(response.body.like)).toBeTruthy();
              expect(response.body.like.length).toEqual(0);
            })
        })

    
    test("POST api/bulkupload/:userId",async()=>{
        const user =  await User.create({ 
            _id: "115560636549278411291", 
            name : "mg",
            lastname : "ji",
            email : "mgji391@gmail.com",
            googleId : "115560636549278411291",
            role:1
          });
        
        const body ={
            data :[{
                name: "Iphone 12 Pro max", 
                description: "Iphone description",
                price :  130000,
                stock :  500,
                sold : 0,
                category : "mobile"
            },{
                name: "Tplink Router", 
                description: "Tp router description",
                price :  13000,
                stock :  500,
                sold : 0,
                category : "router"
            },{
                name: "charger", 
                description: "samsung charger",
                price :  13000,
                stock :  500,
                sold : 0,
                category : "accessories"
            },{
                name: "default", 
                description: "samsung charger",
                price :  13000,
                stock :  500,
                sold : 0
            }]
        }
        await supertest(app)
        .post("/api//bulkupload/"+user._id)
        // .set('Content-Type','application/json') 
        .set('Authorization',"Bearer "+ token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(200)
        .then(async (response) => {
            /////////////////Check For Category///////////////////////
          // Check the response
          expect(response.body).toBeTruthy();
          const res = await Product.find({});
          expect(Array.isArray(res)).toBeTruthy();
          expect(res.length).toEqual(4);
        })
        
    })
})