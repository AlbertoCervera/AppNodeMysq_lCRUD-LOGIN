const mysql  = require("mysql")
const { database,database_prod } = require("./keys")
const {promisify} = require("util")



if(process.env.NODE_ENV=="produccion"){
    var pool = mysql.createPool(database_prod)
}else{
    console.log("dev")
    var pool = mysql.createPool(database)
}



pool.getConnection((err,connection)=>{


    if (err){

        if(err.code ==="conection lost"){
            console.error("DATABASE CONECTION LOST")
        }

        if(err.code ==="COUNT ERROR "){
            console.error("TOO MANY CONNECTIONS")
        }

        if(err.code ==="ECONREFUSED"){
            console.error("DATABASE CONECTION WAS REFUSED")
        }
    }

    if(connection){
        connection.release()
        console.log("DB conected")
    };

    return;

})


pool.query = promisify(pool.query)
module.exports = pool