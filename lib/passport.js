const passport =  require("passport")
const Strategy = require("passport-local").Strategy
const pol = require("../database")
const helpers = require("../lib/helpers")



passport.use("local.signin",new Strategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback:true
},async(req,username,password,done)=>{

    const rows =  await pol.query("SELECT * FROM  users WHERE username = ?",[username])
    console.log(rows)

    if(rows.length >0){

            const user = rows[0]
            const validarpass = await helpers.matchpassword(password,user.password)

            if(validarpass){
                done(null,user,req.flash("success",`bienvenido ${user.username}` ))
            }else{
                done(null,false,req.flash("message","no existe"))
            }


    }else{

        return done(null,false,req.flash("message","el usuario no existe"))
    }
}))









passport.use("local.signup",new Strategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback:true
},async(req,username,password,done)=>{

    console.log(req.body)
    const {fullname,email} = req.body

    
    const newuser = {
        username,
        password,
        fullname,
        email
    }

    newuser.password = await  helpers.encryptPassword(password)


    const result =  await pol.query("INSERT INTO users SET ?",[newuser])
    console.log(result)

    newuser.id = result.insertId



    helpers.mail(email)
    

    return done(null,newuser)



    

}))

passport.serializeUser((usr,done)=>{

    done(null,usr.id)
})


passport.deserializeUser(async(id,done)=>{
    const rows = await pol.query("SELECT * FROM users WHERE id = ?",[id])
    done(null,rows[0])
})





