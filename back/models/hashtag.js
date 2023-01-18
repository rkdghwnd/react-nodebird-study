module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    // id가 기본적으로 들어있다.
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false, // 필수
      },
    },
    {
      chaset: "utf8mb4", // 유니코드 설정, 설정해야 한글 사용가능, mb4 : 이모티콘 사용 가능
      collate: "utf8mb4_general_ci", // 한글 저장, mb4 : 이모티콘 사용 가능
    }
  );
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "Posthashtag" });
  };

  return Hashtag;
};
