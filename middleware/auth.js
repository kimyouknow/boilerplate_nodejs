// auth 기능
// 1. 페이지 이동 때마다 로그인 되있는지 안되어 있는지, 관리자 유저인지 등을 체크
// 2. 글을 쓸때나 지울 때 같은데 권한이 있는지 같은 것도 체크 
const {User} = require("../models/User");
//인증처리하는 곳
let auth = (req, res, next) => {
    // client 쿠키에서 토큰을 가져오기
    let token = req.cookies.x_auth;

    // 토큰을 복호화 핞 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})

        // next req에서도 token, user를 사용하기위해 req에 넣어줌
        req.token = token;
        req.user = user;
        next();
    })
    // 유저가 없으면 인증 노우
}

module.exports = { auth };