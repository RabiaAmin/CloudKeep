const express = require('express');
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv')
dotenv.config();
const connectedToDb = require('./config/db')
connectedToDb();
const cookieParser = require('cookie-parser')

const app = express();
const indexRouter = require('./routes/index.routes')


app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));


app.use('/',indexRouter);
app.use('/user',userRouter);


app.listen(3000,()=>{
    console.log('server is running on port 3000');
})