const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {User} = require("./models/User");

require('dotenv').config();
const PORT = process.env.PORT;

// apllication.x-www-from-urlencoded 형식으로 되어 있는 파일을 읽어옴, 
app.use(bodyParser.urlencoded({extended: true}));
// application/json형식으로 된 파일을 읽어옴 
app.use(bodyParser.json());

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

app.post('/register', (req, res) => {
    // 회원가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣기
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(PORT, handleListenning);