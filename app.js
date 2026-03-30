if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override'); 
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingROuter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//MongoDB connection URI

// const MONGO_URI = 'mongodb://127.0.0.1:27017/WanderLustt';
const dbUrl = process.env.ATLASDB_URL;


main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    // awiat mongoose.connect(MONGO_URI);
    await mongoose.connect(dbUrl);     
}
//mongo db code ends here

//Middleware setup 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});


 
// store.on("error", () => { 
//     console.log("ERROR in MONGO SESSION STORE", err);
// });

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});



const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// app.get("/", (req, res) => {
//     res.send("Hi I am root");
// });      


 


app.use(session(sessionOptions));
app.use(flash()); 

//Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.use((req,res,next) => {
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user;
    next(); 
});
  
// app.get("/demouser",async (req,res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student", 
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });



app.use("/listings", listingROuter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter); 



// app.get("/testlisting", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "A  beautiful villa with sea view",
//         price: 5000,
//         location: "Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("Sample listing saved to database");
//     res.send("Successful testing");
//     });

app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err; 
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});











