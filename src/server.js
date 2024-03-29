import { GraphQLServer } from "graphql-yoga";
import schema from "./schema";
import GoogleStrategy from "./auth/googleOauth";
import JwtStrategy from "./auth/jwt";
import jwt from "jsonwebtoken";
import passport from "passport";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const logger = require("morgan");

const PORT = process.env.PORT || 5000;
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request })
});
const jwtSecret = process.env.JWT_SECRET;

passport.use(JwtStrategy);

server.express.use(bodyParser.urlencoded({ extended: false }));
server.express.use(bodyParser.json());

server.express.use(passport.initialize()); // passport 구동
server.express.use(passport.session()); // 세션 연결

let allowCrossDomain = (req, res, next) => {
  /**
   * :3000, :4000 으로 crossBrowsing 이슈 때문에 구현
   */
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};
server.express.use(allowCrossDomain);

passport.serializeUser((user, done) => {
  // Strategy 성공 시 호출됨
  // console.log("serializeUser");
  done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, done) => {
  // console.log("deserializeUser");
  // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  done(null, user); // 여기의 user가 req.user가 됨
});

passport.use(GoogleStrategy);

server.express.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"]
  })
);

server.express.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    /**
     * google API로 인증받은 후 front-end 로 controll 넘겨서 처리
     */
    const { flag, data } = req.user;
    const url = process.env.HEROKU_URL + "/callback";
    if (flag) {
      res.redirect(url + "/login?email=" + data.email);
    } else {
      res.redirect(url + "/join?email=" + data.email);
    }
  }
);
/**
 * jwt Token 발급 함수
 */
server.express.post("/auth/jwt", async (req, res) => {
  const { email } = req.body;
  const opts = {
    expiresIn: "60m"
  };
  const token = jwt.sign({ email }, jwtSecret, opts);
  return res.status(200).json({
    flag: true,
    jwtToken: token
  });
});
/**
 * jwt Token 발급 후 서버에 요청 시 유효성 체크 함수
 */
server.express.post(
  "/auth/jwt/check",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    return res.json({ flag: true, user: req.user });
  }
);

// server.express.use(logger("dev"));
server.start({ port: PORT }, () => {
  console.log(`========>> Server running on http://localhost:${PORT}`);
});
