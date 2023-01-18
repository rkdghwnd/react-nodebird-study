module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // MySQL 에는 users 테이블 생성
      // id 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      chaset: "utf8", // 유니코드 설정, 설정해야 한글 사용가능
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    // 좋아요 기능, through : N : M 관계테이블 이름 설정, as : 관계에 대한 별칭(상대에 대한)

    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId",
      // 서로 같은 테이블을 관계짓는 경우 속성에 대한 구별이 어려울 수 있으니
      // foreign key의 이름을 따로 명시해서 만드는게 좋다.
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId",
    });
  };

  return User;
};
