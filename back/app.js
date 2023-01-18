// npm i express
// npm i sequelize sequelize-cli mysql2

// mysql2 : node와 mysql을 연결해주는 드라이버

// npx sequelize init (시퀄라이즈 세팅)
// npm i -D -g nodemon (핫 리로딩 지원하는 서버 실행 라이브러리)
// -g 는 글로벌 옵션, 붙여야 cli에서 nodemon 키워드 사용 가능(안하면 npx nodemon 해야함)

// npm i dotdenv

const { json } = require("express");
const express = require("express");
const db = require("./models");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const postsRouter = require("./routes/posts");

const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser"); // npm i cookie-parser
const passport = require("passport");
const passportConfig = require("./passport");
// npm i cors
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config();
const app = express();

// npx sequelize db:create -> (db 생성 명령어)
// 시퀄라이즈와 DB 연결
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공!");
  })
  .catch(console.error);

passportConfig(); // passport 사용

app.use(morgan("dev"));

// cors 모듈로 모든 라우터에 cors 설정
app.use(
  cors({
    origin: "http://localhost:3060", // or origin: true;
    // credentials : true 로 해야 서로 다른 오리진에도 쿠키 전달
    // 쿠키를 전달하지 않으면 누가 요청을 보냈는지 백엔드가 알 수 없다.
    // -> 로그인 후의 백엔드 동작(글쓰기 등)을 막는다
    credentials: true,
  })
);

// 두개의의 메소드는 사실 body-parser를 이용한것(body-parser는 express에 패키지로 설치됨)
// 원래는 const bodyParser = require('body-parser')
// app.use(bodyParser.json())
// app.use(bopyParser.urlencoded({ extended : true }))
// json()과 urlencoded() 는 라우터 실행 이전에 실행되어야 한다.(윗줄에 작성)
app.use(express.json()); // req.body 객체 사용하기 위한 설정
// querystring 모듈대신 qs모듈 사용(body객체를 사용할수 있는 형태로 해석하기 위함)
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    // secret key 생성, secret key를 이용해 세션 암호화
    // 반대로 secret key를 해커가 알면 세션 복호화 가능(보안 위협의 가능성)
    secret: process.env.COOKIE_SECRET,
    resave: false,
    // 새로 생성된 session에 아무런 작업이 이루어지지 않은(uninitialized) 상황
    // false -> uninitialized 상태의 session을 저장하지 않음
    // empty session obj가 쌓이는 걸 방지해 서버 스토리지를 아낄 수 있습니다.
    // 쿠키 사용 정책을 준수하기 위해 false를 쓰기도 합니다.
    saveUninitialized: false,
  })
); // 세션 사용
app.use(passport.initialize()); // passport 초기화
app.use(passport.session()); // npm i express session

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);

// 에러처리 미들웨어
// app.use((err, req, res, next) => {});

app.listen(3065, () => {
  console.log("서버 실행 중");
});
// res.send -> 응답
// res.json -> json형태로 변환 후 전송(배열,객체에 주로 사용)

// res.send든 res.json 이든 응답할때는 json문자열로 변환후(JSON.stringify) 전송한다.
// 다만 json을 변환이 불가능한 데이터의 경우(배열,객체 등)
// res.json을 통해 변환하는 과정이 필요하다.

// ex) 객체,배열 같은 경우 res.json() 을 하지 않으면 node 형태로 전달하기 때문에
// json형태로 변환하는 과정이 필요하다.

// app.get -> 가져오다
// app.post -> 생성하다
// app.put -> 전체 수정
// app.delete -> 제거
// app.patch -> 부분 수정
// app.options -> 찔러보기(메인 요청 이전에 먼저 보내서 확인하는 용도)
// app.head -> 헤더만 가져오기(헤더/바디)

// tip) API 설계하면서 get이나 post냐 put이냐 애매한 부분들이 많을텐데
// 애매하면 post를 쓰면 된다.
// 각 메소드의 용도를 정확하게 쓰는게 RESTAPI의 가장 이상적인 방법이지만
// 현실적으로 불가능하기 때문에 개발자간에 타협을 통해 정하는것이 좋다.

// api 문서는 swagger로 (api 문서 자동화)
