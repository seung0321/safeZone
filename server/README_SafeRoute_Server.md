# SafeRoute Server - AI 기반 안전 경로 추천 백엔드 API

**SafeZone-db**는 모바일 앱 **SafeZone-app**을 위한 백엔드 서버로,  
사용자의 현재 위치부터 목적지까지 CCTV, 가로등, 범죄 데이터 등을 분석하여  
가장 **안전한 도보 경로**를 계산하고 제공하는 RESTful API입니다.

---

## ✨ 주요 기능

### 1. 인증 / 사용자 관리 (Auth / User)
- 회원가입 / 로그인 / 로그아웃
- JWT 기반 인증 (Access / Refresh Token)
- 내 정보 조회 / 수정
- 비밀번호 변경
- 회원 탈퇴

### 2. 안전 경로 추천 (Path)
- 카카오 모빌리티 길찾기 API + 공공데이터 기반 안전 점수 계산
- CCTV, 가로등, 범죄 발생 데이터를 바탕으로 **가장 안전한 도보 경로** 추천
- 경로별 안전 점수 및 위험 구간(Alert) 정보 제공
- 추천 결과를 모바일 앱에서 WebView + 카카오 지도와 연동하여 시각화

### 3. 공공데이터 기반 시설 정보 (Facility)
- CCTV 위치 데이터
- 가로등 위치 데이터
- 범죄 발생 이력 데이터
- R-Tree + Turf.js를 활용한 **공간 조회 및 버퍼(완충 구역) 분석**

### 4. 커뮤니티 (Board / Comment)
- 게시글 작성 / 조회 / 수정 / 삭제
- 댓글 / 대댓글 작성 및 삭제
- 게시판 카테고리(예: 자유, 신고, 문의 등) 지원

### 5. 검색 기록 및 통계
- 사용자의 안전 경로 조회 이력 저장
- 출발지 / 도착지 / 안전 점수 기록
- 향후 대시보드, 통계 분석 등에 활용 가능

---

## 🏗 아키텍처 개요

```
Mobile App (React Native, SafeRoute)
        ↓  REST API 호출
SafeRoute Server (Node.js + Express)
        ↓
PostgreSQL (Prisma ORM)
        ↑
공공데이터(CCTV, 가로등, 범죄)
```

- 클라이언트(React Native 앱)는 `SafeRoute Server`의 REST API를 통해
  - 회원 관리
  - 안전 경로 추천
  - 게시글/댓글 관리
  등을 요청합니다.
- 서버는 카카오 API + 공공데이터 + 자체 로직을 이용해 **안전 점수 기반 경로 추천 결과를 응답**합니다.

---

## 🛠 기술 스택 (Tech Stack)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: JWT (Access / Refresh Token)
- **Validation**: Superstruct 등
- **Logging**: morgan
- **API 문서화**: Swagger (swagger-ui-express)

### Infra / DevOps
- **Deployment**: Render (Server & PostgreSQL)
- **환경 변수 관리**: dotenv

### Testing
- **Test Runner**: Jest
- **HTTP 테스트**: Supertest

---

## 🔐 환경 변수 설정 (.env)

서버 루트 디렉터리에 `.env` 파일을 생성하고 아래와 같이 설정합니다.

```bash
# 서버 기본 설정
PORT=3000
NODE_ENV=development

# 데이터베이스
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 이메일 인증
SENDGRID_API_KEY=SG.your-API-Key
SENDGRID_FROM_EMAIL=your-email

# 카카오 API 키 (백엔드용 REST API 키)
KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

---

## 🚀 로컬 개발 환경 실행 방법

### 1. 저장소 클론

```bash
git clone <your-repository-url>
cd server
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

루트 경로에 `.env` 파일을 생성하고 위에 안내된 값들을 채워 넣습니다.

### 4. Prisma 마이그레이션 & DB 준비

```bash
npx prisma migrate dev
```

필요 시 Seed 스크립트를 사용해 CCTV, 가로등, 범죄 데이터 등을 미리 저장할 수 있습니다.

```bash
npm run seed   # 예: package.json에 seed 스크립트가 정의된 경우
```

### 5. 서버 실행

```bash
# 개발 모드 (nodemon 사용 시)
npm run dev

# 또는 일반 실행
npm start
```

서버가 정상 실행되면 콘솔에 다음과 비슷한 메시지가 출력됩니다.

```bash
🚀 Server running
```

---

## 📂 폴더 구조 예시

> 실제 프로젝트 구조와 비슷한 형태로, 주요 역할을 이해하기 쉽게 정리했습니다.

```bash
server/
├─ src/
│  ├─ app.js               
│  ├─ config/
│  │  └─ database.js      
│  ├─ routes/
│  │  ├─ authRouter.js      
│  │  ├─ userRouter.js     
│  │  ├─ bordRouter.js     
│  │  ├─ commentRouter.js   
│  │  └─ pathRoutes.js     
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ userController.js
│  │  ├─ bordController.js
│  │  ├─ commentController.js
│  │  └─ pathController.js  
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ userService.js
│  │  ├─ bordService.js
│  │  ├─ commentService.js
│  │  └─ pathService.js    
│  ├─ repositories/
│  │  ├─ userRepository.js
│  │  ├─ bordRepository.js
│  │  ├─ commentRepository.js
│  │  └─ facilityRepository.js  
│  ├─ middlewares/
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js 
│  ├─ prisma/
│  │  └─ schema.prisma    
│  └─ swagger/
│     └─ swagger.yaml      
│
├─ tests/
│  ├─ auth.test.js
│  ├─ user.test.js
│  ├─ bord.test.js
│  └─ path.test.js
│
├─ .env                    
├─ package.json
└─ README.md
```
