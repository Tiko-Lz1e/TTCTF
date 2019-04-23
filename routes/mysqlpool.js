var mysql = require('mysql');

var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'mydata',
    multipleStatements: true,
});

var database={};
database.con=function(callback){
    pool.getConnection(function(err,connection){
        if(err){
            console.log('   POOL==>'+err);
        }else{
            callback(connection);
            connection.release();//释放连接
        }
    });
};

module.exports=database;
