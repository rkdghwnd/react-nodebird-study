module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false, // 필수
      },
    },
    {
      chaset: "utf8", // 유니코드 설정, 설정해야 한글 사용가능
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };

  return Image;
};
