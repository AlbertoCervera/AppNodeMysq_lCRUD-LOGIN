var express = require('express');
var router = express.Router();
const { isLoggedIn} = require("../lib/protect")
const pool  = require("../database")

/* GET home page. */
//router.get('/', (req, res, next) =>{
  //res.send("links")
  
//});



router.get('/add',isLoggedIn,(req,res,next)=>{
  res.render("links/add")
  

})



router.post('/add',isLoggedIn,async (req,res,next)=>{
  //res.render("links/add")
  const {title,url,description} = req.body

  const newlink = {
    title,
    url,
    description,
    user_id:req.user.id
  }

 
  
  await pool.query("INSERT INTO LINKS SET ? ",[newlink])
  req.flash("success","links saved successfully")
  res.redirect("/links")

})



router.get('/',isLoggedIn,async (req, res, next) =>{
  
  const links  = await pool.query("SELECT * FROM links")

  //res.send("las listas iran aqui")
  res.render("links/list",{links})
});


router.get('/delete/:id',isLoggedIn,async (req, res, next) =>{
  
  const {id} = req.params

 
  

  await pool.query('DELETE  FROM links WHERE id = ? AND user_id = ?' ,[id,req.user.id] )
  req.flash("success","links deleted successfully")
  //res.send("las listas iran aqui")
  res.redirect("/links")
});


router.get('/edit/:id',isLoggedIn,async (req, res, next) =>{
  
  const {id} = req.params

  const idencontrada = await pool.query("SELECT * FROM links WHERE  id = ? AND  user_id  = ? ", [id,req.user.id])
  //await pool.query('DELETE  FROM links WHERE id = ?' ,[id] )
  
  //res.send("las listas iran aqui")
  res.render("links/edit",{idencontrada})
});


router.post('/edit/:id',isLoggedIn,async (req, res, next) =>{
  
  const {id} = req.params
  const {title,description,url} = req.body

  const editlink = {
    title,
    url,
    description
  }

  const idencontrada = await pool.query('UPDATE links SET  ?  WHERE  id = ?',[editlink,id])
  req.flash("success","links edited successfully")
  
  res.redirect("/links")
});

module.exports = router;
