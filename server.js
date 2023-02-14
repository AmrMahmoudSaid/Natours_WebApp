const dotenv = require('dotenv');
dotenv.config({path : './config.env'})
const app =require('./app');
const  mongoose = require('mongoose')

process.on('uncaughtException' , err=>{
    console.log(err.name , err.message);
    console.log('Uncaught Exception Shutting down ...');
    process.exit(1);
})
const DB =process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser : true ,
    useCreateIndex : true ,
    useFindAndModify : false ,
    useUnifiedTopology : true
}).then(con => console.log("DB connection"));
const port = process.env.PORT;
const server = app.listen(port , ()=>{
    console.log(`app running on port ${port}...`)
});
 process.on('unhandledRejection' , err=>{
     console.log(err.name , err.message);
     console.log('Unhandled Rejection Shutting down ...');
     server.close(()=>{
         process.exit(1);
     })
 })

//npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
