const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 공백을 없애줌
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        // 관리자(1) 아니면 일반유저(0로 구분
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//  pre: save전에 function을 실행 후 save를 실행 
userSchema.pre('save', function(next){
    // 위의 req.body로 받아온 userSchema를 나타냄
    let user = this; 

    // 비밀번호를 바꿀때만 실행, if문이 없으면 email이나 name을 바꿔도 password까지 재암호화시켜버림
    if(user.isModified('password')){
        // 비밀번호 암호화
        // salt를 일단 생성 -> salt를 이용해서 암호화
        // saltround: salt의 자릿수를 결정해줌
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        });
    });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567 vs 암호화된 비밀번호 
    //  암호화된 걸 복호화할 수 없으니 plainpassword를 다시 암호화해서 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    let user = this;
    //jsonwebtoken을 이용해서 token 생성
    //  작동원리
    // user._id + secretToken = token
    //  -> 'sercreToken이 있으면 user._id를 알 수 있음
    let token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token ,cb ){
    let user = this;

    // 토큰을 decode 
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저아이드를 이용해서 유저를 찾은 다으멩 
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}
const User = mongoose.model('User', userSchema)

module.exports = { User }