const companyModel = require('../model/CompanyModel');

module.exports = {
  doGetCompanyList: function (req, res, next) {
    if(req.session.result!=undefined){
      var loginGb = req.session.result[0].LOGIN_GB
      var loginGbStr = loginGb.substring(0, 1)
      if (loginGbStr == "E") {
        companyModel.getCompanyList(loginGb).then(function (result) {
          req.params.companyList = result[0];
          next();
        }).catch(function (err) {
          console.log('컨트롤러의 getCompanyList 에러발생 ');
          next(err); //next(err) -->다음 미들웨어에 에러를 던지며 넘김
        });
      } else {
        next();
      }
    }else{
      next();
    }
  }
}