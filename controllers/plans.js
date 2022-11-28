const PlanMessage = require( '../models/planMessage');
const fetch = require("node-fetch");
const sysconfig = require("../config/systemconfig");
//working
exports.getPlanMessageById = (req,res,next,id)=>{
    PlanMessage.findById(id).exec((err,plan)=>{
           if(err ||  !plan){
               return res.status(400).json({
                   error : "Plan not present in database"
               })
           }
           req.planmessage = plan;
           next();
        })    
}
//working
exports.getPlanMessage = (req,res) => {
    return res.json(req.planmessage)
 }
exports.createPlanNew = (req,res) => {
   
    var newPlanMessage = new PlanMessage({
        plan_schema : req.postmessage._id,
        user: req.profile._id,
        plan:req.postmessage.plan,
        validity:req.postmessage.validity,
        data:req.postmessage.data,
        SMS:req.postmessage.SMS,
        cost:req.postmessage.cost,
        cardId: req.paymentcard._id
    })
    //const newPlanMessage = new PlanMessage({ plan, validity, data, SMS, cost})
    newPlanMessage.save((err,newplanmessage)=>{
        if(err){
            return res.status(400).json({
                error : err//"Unable to save plan to database"
            })
        }
        var fetchOption ={
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                _id : newplanmessage._id,
                price: newplanmessage.cost,
                cardnumber : req.paymentcard.cardnumber,
                expirydate : req.paymentcard.expirydate,
                cvv : req.body.cvv
            })
        }
        fetch(sysconfig.paymentgateway,fetchOption)
                .then(response=>response.json())
                .then(paymentresponse=>{
                    var updateobj;
                    if(paymentresponse.status === false){
                        updateobj = {
                            status : "Failed",
                            error : paymentresponse.error
                        }
                    }else{
                        updateobj ={
                            status : "Success",
                            transaction_id : paymentresponse.referenceno
                        }
                    }
                    
                    PlanMessage.findOneAndUpdate(
                        {_id : paymentresponse._id},
                        {$set : updateobj},
                        {new: true},
                        (err,orderdetails) =>{
                            if(err){
                                return res.status(400).json({
                                    error : "Error while updating plans"
                                })
                            }
                            if(paymentresponse.status === false){
                                res.json({
                                    message :"Payment failed, if amount is debited from your account it will be rolled backed soon"
                                })
                            }else{
                                res.json(orderdetails)  
                            }
                        })
                })
                .catch((err)=>{
                    return res.status(404).json({
                        error : "Error Occured while Connecting to Payment GAteway server"
                    })
                })
    })
}

exports.getMobilePlanPaymentHistory =(req,res)=>{
    PlanMessage.find({user : req.profile._id}).exec((err,plans)=>{
        if(err){
            return res.status(404).json({
                error : "Error While getting plans of user"
            })
        }
        res.json(plans);
    })
}
    
