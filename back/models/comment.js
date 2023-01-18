module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false, // 필수
      },
    },
    {
      chaset: "utf8mb4", // 유니코드 설정, 설정해야 한글 사용가능, mb4 : 이모티콘 사용 가능
      collate: "utf8mb4_general_ci", // 한글 저장, mb4 : 이모티콘 사용 가능
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };

  return Comment;
};
