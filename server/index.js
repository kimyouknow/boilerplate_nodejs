const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const {auth} = require("./middleware/auth");
const {User} = require("./models/User");

require('dotenv').config();

const PORT = process.env.PORT;

// apllication.x-www-from-urlencoded 형식으로 되어 있는 파일을 읽어옴, 
app.use(bodyParser.urlencoded({extended: true}));
// application/json형식으로 된 파일을 읽어옴 
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('./congif/key');

mongoose.connect(config.mongoURI, {
    useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log(err));

const handleListenning = () => 
    console.log(`✅ Listening on: http://localhost:${PORT}`);

app.get('/', function (req, res) {
    res.send('Hello World!!');
})

app.get('/api/hello', ( req, res) => {
    res.send("안녕하세요!!!")
})


app.post('/api/users/register', (req, res) => {
    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣기
    const user = new User(req.body)
    // USer.js의 pre.save작동
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})
app.post("/api/users/login", (req, res) => {
    // 요청된 이메일이 있는지 찾는다
    User.findOne({ email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "It is not a registered email"
            }) 
        } 
        // 요청된 에미일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "Passwords do not match"})

        // 비밀번호까지 맞다면 토큰을 생성하기
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            // 토큰을 저장한다. 어디에? 쿠키, 로코스토리지 등등 
            res.cookie("x_auth",user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id})
            })
        })
    })
})

app.post(' /api/users/auth',auth,  (req, res) => {

    // 여기 까지 middleawre를 통과해서 왔다는 auth가 true라는 뜻
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastName: req.user.lastName,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({_id: req.user._id}, 
        {token: ""},
        (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(PORT, handleListenning);