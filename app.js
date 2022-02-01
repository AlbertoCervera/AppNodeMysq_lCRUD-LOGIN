var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require("connect-flash")


let {engine} = require("express-handlebars")
let favicon = require("serve-favicon")

const session = require("express-session")
const  MYSQLstore = require("express-mysql-session")
const { database } = require("./keys")

const passport = require("passport")


let cors = require("cors")

var indexRouter = require('./routes/index');

let autenticacion = require("./routes/autentication")
let links  = require("./routes/links")


const { handlebars } = require('hbs');
const { dirname } = require('path');


var app = express();

require("./lib/passport")




app.set('views', path.join(__dirname, 'views'));
app.engine(".hbs", engine({

  defaultLayout:"main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"),"partials"),
  extname:".hbs",
  helpers: require("./lib/handlebars")

}))

app.set("view engine", ".hbs")
app.use(session({
  secret:'1234',
  resave:false,
  saveUninitialized:false,
  store: new MYSQLstore(database)
}))

app.use(passport.initialize())
app.use(passport.session())



app.use(flash())

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use ( cors())

app.use((req,res,next)=>{
  app.locals.message = req.flash("message")
  app.locals.success = req.flash("success")
  app.locals.user  = req.user
  next()
})



app.use('/', indexRouter);

app.use('/autentication', autenticacion);
app.use('/links', links);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
