var expHBS = require('express-handlebars');
var express = require("express");
const mongoose = require('mongoose');
var multer  = require('multer');
var path = require("path");
let upload = multer({ dest: 'assets/avatars/'});

var app = express();
const post = 1998;

// var bodyParser=require('body-parser');
// app.use(bodyParser.urlencoded({
//     extended:false
// }));

var url = "mongodb+srv://chinhtao1908:chinhtao1908@cluster0.vyptp.mongodb.net/tinder?retryWrites=true&w=majority";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});


app.engine('handlebars', expHBS({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main'
}));
app.set('view engine','handlebars');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Connected');
});

var user = new mongoose.Schema({
    nameUser:String,
    passUser:String,
    phoneUser:String,
    dateUser:String,
    gioiTinh:String,
    soThich:String,
    gioiThieu:String,
    avatar:String,
})

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        var ect = path.extname(file.originalname);
        if (ect !== '.jpg'){
            cb(new Error("not image"), null);
        }else {
            cb(null,'assets/avatars/');
        }
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    limit:{
        fileSize: 2 * 1500 * 1500
    }
})

upload = multer({storage:storage}).single('avatar');

app.get('/',function (req,res){
    res.render('index');
})
app.use(express.static('assets'));

app.get('/Home.handlebars', function (req, res){
    res.render('Home');
})

app.get('/TimKiem.handlebars', function (req, res){
    res.render('TimKiem');
})

app.get('/HomeAnh.handlebars', function (req, res){
    res.render('HomeAnh');
})

app.get('/HomeUser.handlebars', function (req, res){
    res.render('HomeUser');
})

app.get('/TaiKhoan.handlebars', function (req, res){
    var userModel = db.model('registers', user);
    userModel.find({})
        .then(userlist => {
            res.render('TaiKhoan',{
                user:userlist.map(user=>user.toJSON())
            });
        })
})

app.post('/insert',function (req, res){
    var userModel = db.model('registers', user);
    upload(req, res, function (err){
        if(err instanceof  multer.MulterError){
            return res.send('kích thước file lớn hơn 2MB, không đúng .jgp');
        }else if (err) {
            return res.send('file không xác định');
        }
        userModel({
            nameUser:req.body.nameUser,
            passUser:req.body.passUser,
            phoneUser:req.body.phoneUser,
            dateUser:"",
            gioiTinh:"",
            soThich:"",
            gioiThieu:"",
            avatar:"",
        }).save(function (err){
            if(!err){
                res.render('index', {title : 'exxpress thanh cong'});
            }else{
                res.render('index', {title : 'express failed'});
            }
        })
    });
})

app.get('/:id',(req,res) =>{
    var userModel = db.model('registers', user);
    userModel.findById(req.params.id,(err, user) =>{
        if(!err){
            res.render('HomeUser',{
                user:user.toJSON()
            })
        }
    })
})

app.post('/update',(req,res) =>{
    upload(req, res, function (err){
        if(err instanceof  multer.MulterError){
            return res.send('kích thước file lớn hơn 2MB, không đúng .jgp');
        }else if (err) {
            return res.send('file không xác định');
        }
        var neValue = {$set:{
                nameUser:req.body.nameUser,
                phoneUser:req.body.phoneUser,
                dateUser:req.body.dateUser,
                gioiTinh:req.body.gioiTinh,
                soThich:req.body.soThich,
                gioiThieu:req.body.gioiThieu,
                avatar:'avatars/'+req.file.filename,
            }}
        var userModel = db.model('registers', user);
        userModel.findOneAndUpdate({_id:req.body.id},neValue,{new:true},(err,doc) =>{
            if(!err){
                res.redirect('HomeUser.handlebars');
                console.log("ok");
            }else {
                console.log(err);
            }
        })
    });
})

app.get('/delete/:id', async(req,res) =>{
    try {
        var userModel = db.model('registers', user);
        const users = await userModel.findByIdAndDelete(req.params.id,req.body);
        if(!users){
            res.status(404).send('No item found');
        }
        else{
            res.redirect('/TaiKhoan.handlebars')
        }
    }
    catch (err){
        res.status(500).send(err);
    }
})

app.listen(process.env.PORT || post, () =>
    console.log(`http://localhost:${post}`));
