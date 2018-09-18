const Koa = require("koa");
const bodyParser = require("koa-body");
const Router = require("koa-router");
const serve = require("koa-static");
const path = require("path");
const json = require("koa-json");
const cors = require("@koa/cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3002;

const userCtlr = require("../controller/userController");
const authCtlr = require("../controller/authController");

const { jwtMiddleware } = require("../lib/token");

app.use(serve(path.resolve(__dirname, "../uploads")));

app.use(
  bodyParser({
    formidable: {
      uploadDir: "./server/uploads",
      onFileBegin: (name, file) => {
        console.log(file);
        file.path =
          file.name === null || file.name === ""
            ? "null"
            : (file.path = `${file.path}.${file.type.split("/")[1]}`);
        console.log(file.path);
      }
    },
    multipart: true,
    urlencoded: true
  })
);
app.use(json());
app.use(cors());
app.use(jwtMiddleware);

const mongoUrl =
  "mongodb://ook:cksdnr112!@devlog-shard-00-00-jyyxp.mongodb.net:27017,devlog-shard-00-01-jyyxp.mongodb.net:27017,devlog-shard-00-02-jyyxp.mongodb.net:27017/test?ssl=true&replicaSet=devlog-shard-0&authSource=admin&retryWrites=true";

mongoose
  .connect(
    mongoUrl,
    { useNewUrlParser: true }
  )
  .then(() => console.log("몽고DB 연결 성공"))
  .catch(err => console.log(`몽고DB 연결 실패: ${err}`));

router.get("/", userCtlr.list);

router.get("/api/users/:email", userCtlr.get);

router.post("/api/users", userCtlr.create);

router.get("/api/posts/:email", userCtlr.postList); // 해당 유저 포스트 목록 get

router.post("/api/posts/:email", userCtlr.postUpdate); // 해당 유저 포스트 추가

router.post("/api/posts", userCtlr.imageUpload); // 이미지 업로드

// router.put("/api/posts/:email", userCtlr.imageUpload);

router.get("/api/post/:nickname/:post_id", userCtlr.postView); // 해당 유저 해당 포스트 get

//▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ auth route ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼//
router.post("/api/auth/register", authCtlr.localRegister);
router.post("/api/auth/login", authCtlr.localLogin);
router.get("/api/auth/exists/:key(email|id)/:value", authCtlr.exists);
router.post("/api/auth/logout", authCtlr.logout);
router.get("/api/auth/check", authCtlr.check);

app.use(router.routes());
app.use(router.allowedMethods());

const token = jwt.sign(
  { foo: "bar" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" },
  (err, token) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(token);
  }
);

app.listen(port, () => console.log(`API on ${port}`));
