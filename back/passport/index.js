const passport = require("passport");
const { User } = require("../models");
const local = require("./local");
module.exports = () => {
  passport.serializeUser((user, done) => {
    // routes/user.js의 req.login()이 실행됐을때 실행
    // user.id 값으로 session id 생성(첫 로그인시)
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // user.id 값으로 session id 복구 (로그인 후 매 라우터 요청마다 실행)
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
