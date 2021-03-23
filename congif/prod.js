// 환경변수 process.env.NODE_ENV를 이용해서 deploy(배포)환경에서 비밀정보 관리
// MONGO_URI 여기서는 히로쿠의 값과 똑같이해줘야함 
module.exports = {
    mongoURI: process.env.MONGO_URI
}