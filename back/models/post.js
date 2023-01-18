module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 텍스트, STRING 써도 되고
        allowNull: false, // 필수
      },
    },
    {
      chaset: "utf8mb4", // 유니코드 설정, 설정해야 한글 사용가능, mb4 : 이모티콘 사용 가능
      collate: "utf8mb4_general_ci", // 한글 저장, mb4 : 이모티콘 사용 가능
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "Posthashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
    // 좋아요 기능, through : N : M 관계테이블 이름 설정, as : 관계에 대한 별칭(상대에 대한)

    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
    // db.Post.hasMany(db.Post, { as: "Retweet" });
  };

  return Post;
};
