const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const authToken = req.headers['authorization'];
if (authToken) {
    jwt.verify(authtoken, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }
      req.user = decoded; // Save decoded info for later use
      next();
    });
  } else {
    res.status(401).send("No token provided");
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
