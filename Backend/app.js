const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const captainRoutes = require("./routes/captainRoutes");
const OAuthRoutes = require("./routes/oAuthRoutes");
const mapRoutes = require("./routes/mapRoutes");
const rideRoutes = require("./routes/RideRoutes");
const passport = require("passport");

connectToDB();

app.use(express.json());
app.use(cors({ origin:process.env.CLIENT_URL, credentials: true }));// you need to mention that from what domains you need to accept the request, that you need to mention here in 'cors'.
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/users",userRoutes);
app.use("/captains",captainRoutes);
app.use("/auth",OAuthRoutes);
app.use("/maps",mapRoutes);
app.use("/rides",rideRoutes);

module.exports = app;