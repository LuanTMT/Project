const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID =  "871971576662-bbcj3uh2uo9cgjcle7kcei07ui65umui.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET, 
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {     
      done(null, profile);     
    }
  )
);

//hàm được gọi khi xác thực thành công để lưu thông tin user vào session
passport.serializeUser((user, done) => {
  done(null, user);
});

// hàm được gọi bởi passport.session .Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.use
passport.deserializeUser((user, done) => {
  done(null, user);
});


