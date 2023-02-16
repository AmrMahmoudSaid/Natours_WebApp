const mongoose =require('mongoose');
const validator =require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name :{
        type :String ,
        required : [true , 'User should has a name'],
        trim : true
    } ,
    email :{
        type : String ,
        required :[true , 'User should has a email'] ,
        unique :true ,
        lowercase : true,
        validate : [validator.isEmail ,'not valid email']
    },
    photo :{
        type :String
    },
    role :{
      type : String ,
      enum : ['user' ,'guide' ,'lead-guide' , 'admin'],
        default : 'user'
    },
    password :{
        type : String ,
        required : [true ,'User should has a password'],
        minlength : 8 ,
        select : false
    },
    passwordConfirm :{
        type : String,
        required : [true ,'User should has a password'],
        minlength : 8 ,
        validate : {
            //only works on creat and save
            validator : function (el) {
                return el ===this.password;
            },
            massage : 'passwords are not the same'

        }
    } ,
    passwordChangedAt : Date,
    passwordRestToken : String,
    passwordRestExpires : Date,
    active : {
        type : Boolean ,
        default : true ,
        select : false
    }
})
userSchema.pre('save',async function (next) {
    if (!this.isModified('password')) return next();
    //hash password with cost 12
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
    next();

});
userSchema.pre('save' ,function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() -1000 ;
    next();
} )
userSchema.methods.correctPassword = async function (candidataPassword , userPassword){
    return await bcrypt.compare(candidataPassword,userPassword);
}
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt){
        if (JWTTimeStamp<parseInt(this.passwordChangedAt.getTime()/1000)){
            return true;
        }
    }
    return false;
}
userSchema.methods.creatPasswordRestToken = function (){
    restToken = crypto.randomBytes(32).toString('hex');
    this.passwordRestToken = crypto
        .createHash('sha256')
        .update(restToken)
        .digest('hex');
    this.passwordRestExpires = Date.now() + 10 * 60 * 1000;
    return restToken;
}
const User = mongoose.model('User' ,userSchema);
module.exports = User;