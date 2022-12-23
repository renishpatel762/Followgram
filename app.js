const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const {MONGOURI} = require('./config/keys');

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
    console.log("Conected to mongodb");
});
mongoose.connection.on('error',(err)=>{
    console.error('mongo connection error',err);
});

app.use(express.json());

// models
require('./model/user');
require('./model/post');
require('./model/auth');
require('./model/usercollection');

// routres
app.use(require('./routers/auth'));
app.use(require('./routers/post'));
app.use(require('./routers/user'));
app.use(require('./routers/usercollection'));

app.listen(PORT,()=>{
    console.log("Server is running on port",PORT);
})