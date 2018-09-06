const Koa = require("koa");
const bodyParser = require("koa-body");
const Router = require("koa-router");
const serve = require("koa-static");
const path = require("path");
const json = require("koa-json");
const cors = require("@koa/cors");
const mongoose = require("mongoose");

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3002;

const userCtlr = require("../controller/userController");

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

router.get("/api/posts/:email", userCtlr.postList);

router.post("/api/posts/:email", userCtlr.postUpdate);

router.post("/api/posts", userCtlr.imageUpload);

router.put("/api/posts/:email", userCtlr.imageUpload);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => console.log(`API on ${port}`));
