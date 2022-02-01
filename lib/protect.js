module.exports = {

    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
                return next()

        }else{
            return res.redirect("/autentication/signin")
        }
    },


    isnotLoggedIn(req,res,next){
        if(!req.isAuthenticated()){
                return next()

        }else{
            return res.redirect("/autentication/profile")
        }
    }
}