const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const secretKey = "test";
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: false, saveUninitialized: true,cookie: { maxAge: 1000 * 60 * 60 * 24 }}))

app.use("/customer/auth/*", function auth(req,res,next){
let token = req.session.token;
if(token)
{
    let username = jwt.verify(token , secretKey);
    if(username)
    {
        next();
    }
    else res.status(301).json({ message: 'Invalid Token'});
}
else
{
       res.status(301).json({ message: 'Invalid Token'});
}

});
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));