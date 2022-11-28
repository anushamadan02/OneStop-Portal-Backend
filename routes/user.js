const express = require('express')
const router = express.Router()

const {getUserById,getUser,getAllUsers,userPurchaseList,updateUser} = require("../controllers/user")
const {getCurrentBroadbandPlan,getBroadbandPaymentHistory} = require("../controllers/broadbandops")
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getAllUserCards,addUserCards} = require("../controllers/paymentcards")
const {deleteproductfromcart,addproducttocart,getproductsincart,updateproductoncart,emptycart}=require('../controllers/product')

router.param("userId",getUserById)


router.get("/user/:userId",getUser)//router.get("/user/:userId",isSignedIn,isAuthenticated,getUser)

router.get("/users",getAllUsers);


//router.put("/user/:userId",)

router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)//router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)

router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser);

router.get("/broadband/user/:userId",isSignedIn,isAuthenticated,getCurrentBroadbandPlan) //

router.get("/broadbandpayhis/user/:userId",isSignedIn,isAuthenticated,getBroadbandPaymentHistory)

//Get All added cards of user
router.get("/paymentcards/:userId",getAllUserCards)

router.post("/paymentcards/:userId",addUserCards)

// User's cart operation
router.post("/addtocart/:userId",addproducttocart)
router.get("/cart/:userId",getproductsincart)
router.post("/deletefromcart/:userId",deleteproductfromcart)
router.post("/updateproductoncart/:userId",updateproductoncart)
router.get("/emptycart/:userId",emptycart)


module.exports = router