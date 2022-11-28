const PostMessage = require( '../models/postMessage');
//working
exports.getPostMessageById = (req,res,next,id)=>{
    PostMessage.findById(id).exec((err,post)=>{
           if(err ||  !post){
               return res.status(400).json({
                   error : "Plan not present in database"
               })
           }
           req.postmessage = post;
           next();
        })    
}
//working
exports.getPostMessage = (req,res) => {
    return res.json(req.postmessage)
 }
 //working
 exports.getAllPosts = (req,res) => {
     PostMessage.find({}).exec((err,posts)=>{
         if(err){
             return res.status(400).json({
                 error : "Unable to find plans in database"
             })
         }
          res.json(posts)
     })   
 }
//working
exports.createPost = (req,res) => {
    const { plan, validity, data, SMS, cost} = req.body;
    const newPostMessage = new PostMessage({ plan, validity, data, SMS, cost})
    newPostMessage.save((err,newpostmessage)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to save plan to database"
            })}
        res.json({
            newpostmessage});
    })
}
// working
exports.updatePost = (req,res)=>{
    PostMessage.findOneAndUpdate(
        {_id : req.postmessage._id},
        {$set : req.body},
        {new: true},
        (err,post) =>{
            if(err){
                return res.status(400).json({
                    error : "Error while updating plans"
                })
            }
            res.json(post);
        }
    )
}

//working
exports.deletePost = (req,res) => {
    const postmessage = req.postmessage;
    postmessage.remove((err,deletedPost)=>{
        if(err){
            return res.status(400).json({
                error : "Unable to delete plan in database"
            })
        }
        else if(!deletedPost){
            return res.status(404).json({
                error : "No such plan exists in database"
            })
        }
        res.json({
            message : `Successfully deleted ${deletedPost.plan}`
        })
    })
}
