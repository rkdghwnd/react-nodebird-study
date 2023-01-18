const express = require("express");
const { Post, User, Image, Comment } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();
// npm i morgan

router.get("/", async (req, res, next) => {
  // GET /posts
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // lastId 보다 작은
    }
    const posts = await Post.findAll({
      // where: {id:lastId}
      where,
      limit: 10, // 개수 제한
      // offset: 1, // 인덱스 0번 게시글부터 [limit]개 가져오기, 0~9
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ], // 내림차순 정렬
      include: [
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
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
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
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
