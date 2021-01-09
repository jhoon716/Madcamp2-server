# MadCamp2-server

MadCamp Task 2, Winter 2021 @KAIST

- **Authors**: 김성현(@SunghyunKimKAIST), 이정훈(@jhoon716)

## Simple API's Specifications

### Contacts (Persons)

#### Person schema

``` javascript
const personSchema = new Schema({
    uuid: {type: String, index: true},
    name: String,
    number: String,
    timestamp: Date
});
```

#### API

- `GET /api/persons` : 전체 연락처 조회
- `GET /api/persons/:uuid` : `uuid`로 연락처 조회
- `GET /api/persons/name/:name` : 이름으로 연락처 검색
- `GET /api/persons/newer/:time` : `time` 이후에 업데이트 된 연락처 검색
    (`time` 형식은 ISO format 참고)
- `POST /api/persons` : 새 연락처 추가
- `PUT /api/persons/:uuid` : 연락처 수정
- `DELETE /api/persons/:uuid` : 연락처 삭제

### Gallery (Images)

#### Image schema

``` javascript
const imageSchema = new Schema({
    filename: String,
    path: String
});
```

#### API

- `GET /api/images` : 전체 이미지 파일명 조회
- `POST /api/images` : 새 이미지 업로드
- `GET /api/images/:filename` : 파일 이름으로 이미지 조회
- `DELETE /api/images/:filename` : 이미지 삭제

### Diary (Pages)

#### Page schema

``` javascript
const pageSchema = new Schema({
    date: Date,
    weather: Number,
    comment: String,
    rating: Number
});
```

#### API