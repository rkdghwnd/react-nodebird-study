// 라우터 검사(로그인 여부)
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // 인자가 들어가면 에러처리 미들웨어, 없으면 다음 미들웨어로 넘어감
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
