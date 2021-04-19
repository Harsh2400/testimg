

// Step 1 - set up express & mongoose
var alert = require('alert')
var express = require('express')
var app = express()
//const hbs = require("hbs");
var bodyParser = require('body-parser');
var mongoose = require('mongoose')

var fs = require('fs');
var path = require('path');
var bcrypt = require("bcryptjs")

var check = false;

require('dotenv/config');

// Step 2 - connect to the database
const Resgister = require("./models/registers.js");
const static_path = path.join(__dirname, "../public");

//mongoose.connect("process.env.MONGO_URL",
//    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//        console.log('connected')
//    });

mongoose.connect("mongodb://localhost:27017/ImagesInMongo", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection Successfull...."))
    .catch((err) => console.log(err));

// Step 4 - set up EJS

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Set EJS as templating engine 
app.set("view engine", "ejs");
app.use(express.static(static_path));
//app.set("view engine","hbs");

// Step 5 - set up multer for storing uploaded files

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });


// Step 6 - load the mongoose model for Image

var imgModel = require('./model');
const { Script } = require('vm');



// testing purpose (Homepage addition) 
app.get('/', (req, res) => {
    res.render('loginpage');
});

app.get("/register", (req, res) => {
    res.render("loginpage")
});
app.get("/login", (req, res) => {
    res.render("loginpage")
});


app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {

            const registerUser = new Resgister({
                userid: req.body.userid,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                confirmpassword: cpassword
            })
            const registered = await registerUser.save();
            res.status(201).render("loginpage");

        } else {
            res.send("password are not matching")
        }

    } catch (error) {
        //res.status(400).send(error);
        res.render('loginpage')
    }

})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Resgister.findOne({ email: email });

        if (useremail.password === password) {
            res.status(201).render("index");
            check = true
        } else {
            //res.send("password are not matching")
            res.render("loginpage")
            //alert("Incorrect Password OR Username")
            //window.alert("Incorrect")

        }


    } catch (error) {
        res.status(400).send("invalid email")
    }


})
//adsection testing
app.get('/adpost', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            if(check == true){
                res.render('adpost', { items: items });
            }
        }
    });
});


// Step 7 - the GET request handler that provides the HTML UI
app.get('/ad', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
              res.render('imagesPage', { items: items });
        }
    });

});
//index
app.get('/index', (req, res) => {
    if(check == true){
        res.render('index');
    }
});
//logout
app.get('/logout', (req, res) => {
    check = false;
    res.render('loginpage');
});



// Step 8 - the POST handler for processing the uploaded file

app.post('/', upload.single('image'), (req, res, next) => {

    var obj = {
        name: req.body.name,
        town: req.body.town,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        desc: req.body.desc
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('adpost');
        }
    });
});


// Step 9 - configure the server's port

var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})