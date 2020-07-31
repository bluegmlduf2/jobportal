const mysql = require('mysql');
const appRoot = require('app-root-path').path.replace(/\\/g, "/");
let db = require(appRoot + "/conf/db_info");
const crypto = require('crypto'); //암호화

module.exports = {
  //Select jobList 
  postIdCheck: function (id) {
    return new Promise((resolve, reject) => {
      const con = mysql.createConnection(db);
      var sql = 'SELECT COUNT(*) AS CNT\
      FROM LOGIN_TBL\
      WHERE LOGIN_ID=?'
      var execSql = con.query(
        sql, id, (err, result, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      console.log(execSql.sql);
      con.end();
    });
  },
  postMailCheck: function (mail) {
    return new Promise((resolve, reject) => {
      const con = mysql.createConnection(db);
      var sql = 'SELECT COUNT(*) AS CNT\
      FROM LOGIN_TBL\
      WHERE LOGIN_MAIL=?'
      var execSql = con.query(
        sql, mail, (err, result, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      console.log(execSql.sql);
      con.end();
    });
  },
  putLogin: function (parse) {
    return new Promise((resolve, reject) => {
      const con = mysql.createConnection(db);
      var sql = 'SELECT COUNT(*) AS CNT\
      FROM LOGIN_TBL\
      WHERE LOGIN_MAIL=?'
      var execSql = con.query(
        sql, mail, (err, result, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      console.log(execSql.sql);
      con.end();
    });
  },
  putCandidate: async(jsonStr)=>{
    var jsonObj = JSON.parse(jsonStr)

    const con = await mysql.createPool(db).getConnection();
    try {
      
      await con.beginTransaction() // 트랜잭션 적용 시작
       
      //CANDIDATE INSERT
      const sql1 = "INSERT CANDIDATE_TBL (\
        CANDIDATE_IDX\
        ,CANDIDATE_NM\
        ,CANDIDATE_PHONE\
        ,CANDIDATE_ADDR\
        ,CANDIDATE_IMAGE\
        ,CANDIDATE_SEX\
        ,CANDIDATE_BIRTH\
        ,CANDIDATE_DATE\
        ,CANDIDATE_WANT\
        ,CANDIDATE_WANT_DETAIL)\
        VALUES(\
        (SELECT CONCAT('C',MAX(SUBSTRING(C.CANDIDATE_IDX,2))+1) FROM CANDIDATE_TBL AS C)\
        ,?\
        ,?\
        ,?\
        ,?\
        ,?\
        ,?\
        ,NOW()\
        ,?\
        ,?)";

      const sqlParamArr1 = [
        jsonObj.NAME
        , jsonObj.PHONE
        , jsonObj.ADDRESS
        , jsonObj.CANDIDATE_IMAGE
        , jsonObj.SEX
        , jsonObj.BIRTH_DATE
        , jsonObj.JOB_TYPE
        , jsonObj.JOB_TYPE_DETAIL
      ];
      
      let cInsertId;

      const execSql1 =await con.query(sql1, sqlParamArr1, (err, result, fields) => {
        if (err) {
          return console.error(err.message);
        }
        // get inserted id
        console.log(result.insertId);
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log('Inserted Id:' + result.insertId);
        cInsertId=result.insertId;
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      });
      console.log(execSql1.sql);

      //CANDIDATE DETAIL INSERT
      const sql2 = "INSERT CANDIDATE_DETAIL_TBL(\
        CANDIDATE_DETAIL_IDX\
        ,CANDIDATE_IDX\
        ,CANDIDATE_INTRO)\
        VALUES (\
        (SELECT CONCAT('CD',MAX(SUBSTRING(CD.CANDIDATE_DETAIL_IDX,3))+1) FROM CANDIDATE_DETAIL_TBL AS CD)\
        ,?\
        ,?)";

      const sqlParamArr2 = [
        cInsertId
        , jsonObj.SELF_INTRODUCTION
      ];

      const execSql2 =await con.query(sql2, sqlParamArr2);
      console.log(execSql2.sql);

      var encryptionPass=crypto.createHash('sha256').update(jsonObj.PASSWORD).digest('hex')

      //LOGIN INSERT
      const sql3 = "INSERT LOGIN_TBL(\
        LOGIN_GB\
        ,LOGIN_ID\
        ,LOGIN_PASS\
        ,LOGIN_MAIL\
        ,LOGIN_LASTIN)\
        VALUES (\
        ?\
        ,?\
        ,?\
        ,?\
        ,NOW())";

      const sqlParamArr3 = [
        cInsertId
        , jsonObj.ID
        , encryptionPass
        , jsonObj.EMAIL
      ];

      const execSql3 =await con.query(sql3, sqlParamArr3);
      console.log(execSql3.sql);

      await con.commit() // 커밋
      
      next()
    } catch (err) {
      console.log(err)
      con.rollback()
      return res.status(500).json(err)
    } finally {
      con.release() // pool에 connection 반납
    }
  },
  putCandidateDetail: function (param) {
    return new Promise((resolve, reject) => {
      const con = mysql.createConnection(db);
      var sql = 'SELECT COUNT(*) AS CNT\
      FROM LOGIN_TBL\
      WHERE LOGIN_MAIL=?'
      var execSql = con.query(
        sql, mail, (err, result, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      console.log(execSql.sql);
      con.end();
    });
  }
}