var express = require('express');
const passport = require("passport");
var router = express.Router();

let  nodemailer = require('nodemailer');

const { isLoggedIn,isnotLoggedIn} = require("../lib/protect");
const pool = require('../database');
const helpers = require('../lib/helpers');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.send("authentication")
  
});

router.get('/signup',isnotLoggedIn, function(req, res, next) {
  res.render("auth/signup")
 
  
});

router.post('/signup',isnotLoggedIn,passport.authenticate("local.signup",{
    successRedirect: "/autentication/profile",
    failureRedirect: "/autentication/signup",
    failureFlash:true


  
  })

  
  );



  router.get('/signin',isnotLoggedIn, function(req, res, next) {
    res.render("auth/login")
   
    
  });



  router.post('/signin',isnotLoggedIn,(req,res,next)=>{
    passport.authenticate("local.signin",{
      successRedirect: "/autentication/profile",
      failureRedirect: "/autentication/signin",
      failureFlash:true

  })(req,res,next)

});


router.get("/profile", isLoggedIn,(req,res)=>{
  res.render("profile")
})


router.get("/logout",(req,res)=>{

  req.logOut()
  res.redirect("/autentication/signin")
})



router.get("/recu",(req,res)=>{
  res.render("auth/recupass")
})



router.get("/jwt",(req,res)=>{


  res.render("auth/jwtvalido")
})


router.post("/validjwt",async(req,res)=>{
  const {token} = req.body

  const valid = await helpers.compararjwt(token)

  
  if(valid){

    return res.redirect(`/autentication/changepass/${valid}`)
  }else{

    req.flash("message","token no valido")
    return res.redirect("/autentication/jwt")
    
  }
})



router.post("/recu",async(req,res)=>{
  
  const {user} = req.body

  const existe = await helpers.existeusu(user)
 


  if(existe){
    const id = existe[0].id
    const mail = existe[0].email

    const JWT = await helpers.generarJWT(id)
    

    helpers.mail(mail,JWT)

    req.flash("success","se envio un mensaje")

   return  res.redirect("/autentication/jwt")
  }else{
    req.flash("message","error")
   return   res.redirect("/autentication/signup")
  }
 
})



router.get("/changepass/:id",(req,res)=>{

  const {id} = req.params
  
  
  res.render("auth/changepass",{id})
})



router.post("/changepass/:id",async(req,res)=>{

  const {id} = req.params
  const {pass} = req.body
  
  console.log(pass)

  const encriptar  =await  helpers.encryptPassword(pass)

  const upadate = await pool.query('UPDATE users SET password = ?  WHERE  id = ?' ,[encriptar,id])

  
  req.flash("success","contraseña cambiada")
  console.log(id)
  res.redirect("/autentication/signin")
})








module.exports = router;
