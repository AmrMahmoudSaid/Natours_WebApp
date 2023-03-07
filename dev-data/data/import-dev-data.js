const dotenv = require('dotenv');
const  fs = require('fs');
const tour= require('../../models/tourModel');
const user= require('../../models/userModel');
const review= require('../../models/reviewModel');

dotenv.config({path : './config.env'})
const  mongoose = require('mongoose')
// console.log((process.env));
const DB =process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser : true ,
    useCreateIndex : true ,
    useFindAndModify : false ,
    useUnifiedTopology : true
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

const importData =async ()=>{
    try{
        await tour.create(tours);
        await user.create(users , {validateBeforeSave : false});
        await review.create(reviews);
        console.log('Data successfully loaded');
        process.exit();
    }catch (err){
        console.log(err)
    }
}
const deleteData = async ()=>{
    try{
       await tour.deleteMany();
        await user.deleteMany();
        await review.deleteMany();

        console.log('Data successfully deleted');
        process.exit();
    }catch (err){
        console.log(err);
    }
}
if (process.argv[2]==='--import'){
    importData();
}else  if (process.argv[2]==='--delete'){
    deleteData();
}
console.log(process.argv);