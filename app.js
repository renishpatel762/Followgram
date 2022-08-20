const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// app.get('/',(req,res)=>{
//     console.log("Welcome to home");
//     res.json({message:"Hello"})
//})
app.use(express.json());
app.use(require('./routers/auth'));

app.listen(PORT,()=>{
    console.log("Server is running on port",PORT);
})