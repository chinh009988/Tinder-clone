var expHBS = require('express-handlebars');
var express = require("express");
var app = express();
const post = 3000;
app.engine('handlebars', expHBS({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main'
}));
app.set('view engine','handlebars');

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

app.get('/DanhSach.handlebars', function (req, res){
    res.render('DanhSach');
})
app.listen(process.env.PORT || post, () =>
    console.log(`http://localhost:${post}`));
