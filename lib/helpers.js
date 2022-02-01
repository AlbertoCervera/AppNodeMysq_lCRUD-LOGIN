const helpers = {}
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let  nodemailer = require('nodemailer');
const pool = require('../database');


helpers.encryptPassword =async (password)=>{

  const salt =  await bcrypt.genSalt(10)
  const hash =  await bcrypt.hash(password,salt)

  return hash

}

helpers.matchpassword =async (password,savepassword)=>{
    try{
       return  await bcrypt.compare(password,savepassword)

    }catch(err){
        if(err){
            console.log(err)
        }

    }
    
}


helpers.mail = (mail,message="bienvenido")=>{

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nicolascfv@gmail.com',
          pass: 'Micasa28'
        }
      });

      let mensaje = `este es tu codigo:  ${message}`;

    let mailOptions = {
        from: 'nicolascfv@gmail.com',
        to: mail,
        subject: 'Asunto Del Correo',
        text: mensaje
        };

    transporter.sendMail(mailOptions, (error, info)=>{
    if (error) {
        console.log(error);
    } else {
        console.log('Email enviado: ' + info.response);
    }
    });

    
}


helpers.existeusu  = async(usuario)=>{
    
  const peticion  =await  pool.query("SELECT * FROM users WHERE username = ? ",[usuario])
    let existe = false
    console.log(peticion)

  if(peticion.length  > 0 ){
    
    console.log("encontrado")
    existe = true
    return peticion

  }else{
    console.log("no")
    existe = false
  }

  return existe
}


helpers.generarJWT = (uid)=>{

  return new Promise((resolve,reject)=>{

      const payload = {uid}

      jwt.sign(payload, "secret",{
          expiresIn:"4h",
  
      },(err,token)=>{
          if(err){
              console.log(err)
              reject("no se pudo generar")
          }else{
              resolve(token)
          }
      })

  })
}


helpers.compararjwt = async (token)=>{


  try{

    const {uid} = jwt.verify(token,"secret")
    

    const existID =await  pool.query("SELECT * FROM users WHERE id = ?",[uid])

    return existID[0].id
    
  }catch (err){

    console.log(err)

  }
}

module.exports = helpers