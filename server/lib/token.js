const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

generateToken = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: "3d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

decodeToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) reject(error);
      resolve(decoded);
    });
  });
};

exports.generateToken = generateToken;

exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get("access_token"); // ctx에서 토큰을 읽어옴
  if (!token) return next(); // 토큰이 없으면 다음 작업 수행

  try {
    const decoded = await decodeToken(token); // 토큰을 디코딩 함

    // 토큰 만료일이 하루 남았으면 토큰 재발급
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      // 하루가 지나면 갱신해준다
      const { id, thumnail, nickname } = decoded;
      const freshToken = await generateToken(
        { id, thumnail, nickname },
        "user"
      );
      ctx.cookies.set("access_token", freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3days
        httpOnly: true
      });
    }

    // ctx.request.user 에 인코딩 된 값을 넣어준다
    ctx.request.user = decoded;
  } catch (err) {
    // token validate 실패
    ctx.request.user = null;
  }

  return next();
};
