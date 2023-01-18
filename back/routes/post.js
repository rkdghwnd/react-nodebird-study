const express = require("express");
const { Post, User, Image, Comment, Hashtag } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();
const path = require("path"); // nodejs에서 기본제공
// npm i multer
// 이미지 업로드를 위한 미들웨어,
// multipart/form-data 형식을 백엔드에서 처리하기위한 미들웨어
// 기존 백엔드는 express.json()과 express.urlencoded({extended: true})
// 형식으로만 데이터를 받고 있다.
// 그래서 다른 형식 처리를 위해서 multer를 사용해야만 한다.
// multer는 형식을 바꾸는 것이기 때문에 전체 라우터 x, 개별 라우터에 적용
const multer = require("multer");

const fs = require("fs");
try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads"); // 이미지 저장할 폴더가 만들어져 있지 않은 경우 폴더생성
}

const upload = multer({
  // storage : 파일을 저장할 장소 설정
  // diskStorage : 하드 디스크에 저장
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + "_" + new Date().getTime() + ext); // 제로초125345235.png
      // getTime은 파일을 덮어씌우는것을 방지하기 위해 설정한 것일 뿐임
    },
  }),
  // 20MB로 용량 제한(제한 안하면 해커공격에 이용될 수 있음)
  limits: { fileSize: 20 * 1024 * 1024 },
});

// upload.none() -> 이미지가 없고 다른것(텍스트 등)이 있다
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post
  try {
    const hashtags = req.body.content.match(/(#[^\s#]+)/g);

    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // passport deserialize 로 부터 받음
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(
          (tag) =>
            Hashtag.findOrCreate({
              where: { name: tag.slice(1).toLowerCase() },
            }) // 이미 존재하면 생성 x
        ) // [[노드, true], [리액트, true]]
      );
      console.log(result);
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
        // Image.create({}) 가 promise 객체이기 때문에 Promise.all 사용 가능
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images); // foreign key 설정
      } else {
        // 이미지를 하나만 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment, // 댓글 작성자
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// upload.array("image") -> 이미지 여러개
// upload.single("image") -> 이미지 한개
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"), // 이미지를 저장소에 업로드한다.
  async (req, res, next) => {
    // POST /post/images
    console.log(req.files); // 업로드한 이미지에 대한 정보
    res.json(req.files.map((y) => y.filename));
  }
);

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // POST /post/:postId/comment
  try {
    // 존재하는 게시글인지 검사(보안)
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId),
      UserId: req.user.id, // passport deserialize 로 부터 받음
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });

    res.status(201).json(fullComment);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id); // 시퀄라이즈 관계 메서드
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id); // 시퀄라이즈 관계 메서드
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res) => {
  //DELETE /post
  try {
    await Post.destroy({
      // UserId를 추가한 이유는 보안(다른사람이 삭제하지 못하게 하기 위해)
      where: { id: parseInt(req.params.postId), UserId: req.user.id },
    });
    res.json({ PostId: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  // POST /post/:postId/comment
  try {
    // 존재하는 게시글인지 검사(보안)
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    // req.user.id === post.UserId -> post(리트윗할 게시물)자기 게시글을 리트윗 시도하는 경우
    // post.Retweet && post.Retweet.UserId === req.user.id
    // 나의 게시글을 누군가가 리트윗 한 게시글을 내가 리트윗 시도하는 경우
    // (나의 게시글 A) --> (내 게시글 리트윗한 게시글 B) --> (B를 리트윗하는 A)
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }
    const retweetTargetId = post.RetweetId || post.id;
    // post.ReweetId 인 경우 ->
    // 내가 리트윗시도하는 게시글이 리트윗으로 생성된 게시글이고
    // 내가 원게시글을 이미 리트윗한 게시글이 있는경우
    // post.id 인 경우 -> 내가 이미 리트윗한 게시글이 있는 경우
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    }); // 이미 리트윗한 것을 리트윗한 게시글
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        { model: User, as: "Likers", attributes: ["id"] }, // 좋아요 누른 목록
      ],
    });
    res.status(201).json(retweetWithPrevPost);
    // TIP)
    // 나중에 include가 길어지면 테이블에서 정보를 가져오는데 시간도 오래걸리고
    // 코드의 가독성도 떨어지게 된다. 이 부분을 해결하기 위한 방법
    // 1. 라우터를 더 만들어서 image 따로 , comment 따로 불러오는 방법
    // 2. 세부적으로 꼭 필요한 상황에서만 데이터를 가져오거나
    // (댓글창 열때만 댓글 볼 수 있으니까 댓글을 가져온다던지)
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
