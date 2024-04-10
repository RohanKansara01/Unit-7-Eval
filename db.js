const mongoose=require('mongoose');

const connection=mongoose.connect(`mongodb+srv://rohankansara2000:test@databasetest.cehhvv0.mongodb.net/Eval3`)

const userSchema=mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    phone_number:{type:Number, required:true},
    department:{type:String, required:true},
})

const noticeSchema=mongoose.Schema({
    title:{type:String, required:true},
    body:{type:String, required:true},
    category:{type:String, required:true, enum:["parking", "covid", "maintenance"]},
    date:{type:String, required:true}
})

const UserModel=mongoose.model("user",userSchema);
const NoticeModel=mongoose.model("notice",noticeSchema);

module.exports={connection, UserModel, NoticeModel};

//name, email, password, phone_number, department

//       -  title
//       -  body
//       -  category (any one of these categories only - parking, covid, maintenance)
//       -  date