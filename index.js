const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { UserModel, connection, NoticeModel } = require('./db');
const bodyParser=require('body-parser');
const cors=require('cors');
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


//AuthMiddleware
const AuthMiddleware=(req,res,next)=>{
    try {
        const token=req.headers.AuthMiddleware.split(" ")[1];
        console.log(token);
        jwt.verify(token, "rohan", async function(err, decode){
            console.log(decode);
            const user_ID=await UserModel.findOne({_id:decode.userID})
            req.u_ID=user_ID;
            if(err){
                res.send("Login Required 1");
            }else{
                next();
            }
        })
    } catch (error) {
        res.send("Login Required");
    }
}







// app.get("/user",async(req,res)=>{
//     try {
//         console.log("listening")
//     } catch (error) {
//         console.log(error)
//     }
// })


//Registering

app.post("/register", async(req,res)=>{
    try {
        const user=req.body;
        const hashed=user.password;
        bcrypt.hash(hashed,6,async function(err,hash){
            if(err){
                res.send("error in the password");
            }else{
                await UserModel.create({
                    name:user.name,
                    email:user.email,
                    password:hash,
                    phone_number:user.phone_number,
                    department:user.department
                })
                res.send(req.body);
                console.log(hash);
            }
        })
    } catch (error) {
        console.log("Error registering new user");
    }
})


//Logging In

app.post("/login",async(req,res)=>{
    try {
        const data=req.body;
        const email=data.email;
        const user=await UserModel.findOne({email});
        // console.log(email, user);
        const hashed=user.password;
        // console.log(data.password, hashed);
        bcrypt.compare(data.password, hashed, function(err, result){
            if(result===true){
                const token=jwt.sign({userID:user._id}, "rohan");
                console.log(token);
                res.send({message: 'you are logged in', token:token});
                console.log(token);
            }else{
                res.send('user not found');
                console.log("error during login",err);
            }
        })
    } catch (error) {
        console.log("Error Logging In");
    }
})


//Notice fetching
app.get("/notice", AuthMiddleware, async(req,res)=>{
    const user=req.u_id;
    try {
        const data=await NoticeModel.find();
        res.send(data);
        console.log("Data Displayed successfully");
    } catch (error) {
        console.log(error);
    }
})

//Notice filtering
app.get('/notice/filter',AuthMiddleware, async(req,res)=>{
    try {
        let query={};
        if(req.query.category){
            query.category=req.query.category;
            const notices=await NoticeModel.find(query);
            res.json(notices);
        }
    } catch (error) {
        res.send("Error sorting and filtering the notcies");
    }
})

//Creating Notice
app.post('/notice/create',AuthMiddleware,async(req,res)=>{
    try {
        const data=await NoticeModel.create(req.body);
        res.send(data);
        console.log("Notcie created successfully");
    } catch (error) {
        console.log("Error creating the notice");
    }
})

//Updating Notice
app.put('/notice/:noticeID',AuthMiddleware,async(req,res)=>{
    try {
        const data=req.body;
        // console.log(data);
        const update=await NoticeModel.findById(req.params.noticeID);
        console.log(update);
        update.title=data.title || update.title;
        update.body=data.body || update.body;
        update.category=data.category || update.category;
        update.date=data.date || update.date;
        const updatedNotice=await update.save();
        res.send("Notice updated successfully");
        console.log(updatedNotice);
    } catch (error) {
        console.log("Error Updating the notice");
    }
})

//Notice deletion
app.delete('/notice/:noticeID',AuthMiddleware, async(req,res)=>{
    try {
        const data=await NoticeModel.findByIdAndDelete(req.params.noticeID);
        res.send(data);
        console.log("Notice deleted successfully");
    } catch (error) {
        console.log("Error deleting the notice");
    }
})


const PORT=8080;
app.listen(PORT,()=>{
    try {
        console.log(`Listening on Port ${PORT}`);
    } catch (error) {
        console.log("error connecting to the server");
    }
})


// {
//     "title":"abc",
//     "body":"notice!!!",
//     "category":"covid",
//     "date":"20/03/2020"
// }

// {
//   "name": "abc",
//   "email":"abc@gmail.com",
//   "password":"abc@123",
//   "phone_number":1234567890,
//   "department":"Tech"
// }