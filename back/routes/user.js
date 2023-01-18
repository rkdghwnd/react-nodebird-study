const express = require("express");
// npm i bcrypt
// 비밀번호 암호화(해싱) 모듈
const bcrypt = require("bcrypt");
// npm i passport passport-local
// passport : passport 로그인 방식 지원 라이브러리
// passport-local : 로컬로그인(아이디, 비밀번호 입력하는 로그인) passport 라이브러리
const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router(); // express 라우터 기능 가져오기
const passport = require("passport");

// 로그인 정보 유지
router.get("/", async (req, res, next) => {
  // GET /user
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id }, // 조건
        // 가져올 속성
        attributes: { exclude: ["password"] }, // password 제외하고 가져오기
        include: [
          // 추가적으로 포함할 테이블(관계가 설정되어있는 테이블 중에)
          {
            model: Post,
            attributes: ["id"], // 데이터 효율을 위해 필요한 데이터만
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // POST /user/login
    // 매개변수 : passport local.js 에서 done으로 전달된 인자들
    if (err) {
      console.error(err);
      next(err);
    }
    if (info) {
      // 클라이언트 쪽 에러
      return res.status(401).send(info.reason); // 401 : 허가되지 않음
    }

    // passport 로그인
    // indes.js의 serializeUser(user, done) => {...} 실행
    return req.login(user, async (loginErr) => {
      // passport 로그인에서 에러가 날 경우
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id }, // 조건
        // 가져올 속성
        attributes: { exclude: ["password"] }, // password 제외하고 가져오기
        include: [
          // 추가적으로 포함할 테이블(관계가 설정되어있는 테이블 중에)
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      // res.setHeader('Cookie', 'cxlhy')
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next); // 미들웨어 확장
  // passport.authenticate()는 미들웨어를 리턴한다
  // 내부 콜백함수를 실행하려면 미들웨어를 호출해야하기 때문에
  // passport.authenticate()() 형태로 호출을 해야하고
  // req, res, next를 사용하기 위해서 인자로 전달해준다.
  // -> 미들웨어 안에서 미들웨어를 사용하는 형태로 '미들웨어 확장'이라 부른다.
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  // console.log(req.user);
  req.logout(() => {
    req.session.destroy(); // session 삭제
  }); // request.user 라는 데이터를 삭제하고, session store에 있는 passport 데이터를 삭제
  res.send("ok");
});

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  // POST /user/
  const exUser = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (exUser) {
    // return을 해서 아래 문장이 실행 안되도록(안하면 send 두번 실행, send 두번 실행하면 에러)
    return res.status(403).send("이미 사용중인 아이디입니다.");
  }
  // bcrypt.hash(암호화(해싱)할 데이터, 보안수준) : 암호화(해싱), 암호화 연산수준 설정가능
  // 보안수준이 높을수록 연산시간이 늘어남, 지연시간을 측정하면서 상황에 따라 맞추는것이 좋다
  // tip) 보통 1초정도 걸리는 숫자로 맞춘다.
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 13);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // CORS 설정
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3060");
    // 또는 npm i cors 설치해서 app.js에 적용
    res.status(200).send("ok"); // status 기본값 200인데 왠만하면 생략 안하는걸 추천
  } catch (error) {
    // 백엔드 서버 쪽 에러
    console.error(error);
    next(error); // 응답으로 에러전송, 상태코드 500
  }
});

// 닉네임 변경
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body);
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("없는 사람을 차단하시려고 하시네요?");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/1/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/1/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
