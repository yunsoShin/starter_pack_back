
# 스타터팩

이 프로젝트는 MSA 또는 새로운 프로젝트를 시작할 때 반복되는 초기 구성을 간편하게 설정할 수 있도록 제작되었습니다. `docker-compose`를 사용하여 MySQL, NestJS, ELK Stack을 포함한 필수 구성 요소들을 빠르게 셋업하고 배포할 수 있습니다. 추후 DB 종류나 메시지 브로커, 인메모리 캐시 등 다양한 기능을 추가할 수 있도록 확장 가능하게 설계되었습니다.

## 프로젝트 구성
- **MySQL**: 데이터베이스
- **NestJS**: 백엔드 API 서버
- **ELK Stack**:
- **Elasticsearch**: 로그 저장 및 검색
- **Logstash**: 로그 수집 및 파싱
- **Kibana**: 로그 분석 및 시각화
- **Docker Compose**: 전체 서비스의 컨테이너화 및 관리

## 시작하기

### 1. 의존성 설치
먼저 Docker와 Docker Compose가 로컬에 설치되어 있어야 합니다. 설치가 안 되어 있다면 [Docker 공식 사이트](https://docs.docker.com/get-docker/)에서 설치하세요.

### 2. 환경 변수 설정
`./docker` 폴더 내에 있는 `.env_example` 파일을 참고하여 `.env` 파일을 생성한 후, 환경 변수를 설정하세요.

```bash
# .env 파일 예시
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yo!ur_pas!sw@o!r1d
DB_NAME=database_name

# 개발 환경 변수
IS_DEV=true

# MySQL 관련 설정
MYSQL_ROOT_PASSWORD=yo!ur_pas!sw@o!r1d
MYSQL_DATABASE=database_name

JWT_SECRET=1919!!@@77ss
BACKEND_PORT=9976
```

.env 파일의 변경 사항이 있을 때는 다음 명령어로 마운트를 삭제하거나 컴포즈 설정을 변경해 적용해야 합니다:

docker-compose down -v

> ⚠️ 보안을 위해 .env 파일은 버전 관리에서 제외되어야 합니다. .gitignore에 포함하는 것을 잊지 마세요.



3. Docker Compose로 서비스 실행

.env 파일 설정이 완료되면 다음 명령어로 Docker Compose를 실행하여 모든 서비스를 띄울 수 있습니다:

cd docker
docker-compose up -d

이 명령어는 모든 컨테이너를 백그라운드에서 실행합니다. 실행된 컨테이너 상태를 확인하려면:

docker-compose ps

4. 서비스 접속

NestJS API: http://localhost:${BACKEND_PORT}

Kibana (로그 분석 및 시각화): http://localhost:5601

Elasticsearch: http://localhost:9200


프로젝트 구조
```bash
.
├── backend               # NestJS 소스 코드 및 관련 파일
├── deploy                # 배포 관련 파일
├── docker
│   ├── .env_example      # 환경 변수 예시 파일
│   ├── docker-compose.yml# Docker Compose 설정 파일
│   ├── dockerfile.backend# NestJS Dockerfile
│   ├── dockerfile.frontend# 프론트엔드 Dockerfile
│   ├── dockerfile.mysql  # MySQL Dockerfile
│   ├── init.sql          # MySQL 초기화 스크립트
│   ├── logstash.conf     # Logstash 설정 파일
│   ├── my.cnf            # MySQL 설정 파일
│   └── pipelines.yml     # Logstash 파이프라인 설정 파일
├── .gitignore            # Git에서 추적하지 않을 파일 목록
└── README.md             # 리드미 파일

```
Docker Compose 구성 설명

backend: NestJS 백엔드 애플리케이션을 위한 컨테이너입니다. 환경 변수는 .env 파일을 통해 정의되며, MySQL 데이터베이스와 의존성을 가집니다.

mysql: MySQL 데이터베이스 컨테이너로, 초기화 스크립트와 설정 파일(my.cnf)이 포함되어 있습니다. 데이터는 db_data 볼륨에 저장됩니다.

elasticsearch: Elasticsearch 노드로, 로그 데이터를 저장하며, 보안이 비활성화되어 있습니다.

logstash: 로그 데이터를 수집하여 Elasticsearch로 전송하는 컨테이너입니다.

kibana: Kibana 인터페이스로, Elasticsearch 데이터를 시각화하고 분석할 수 있습니다.


모든 서비스는 mynetwork라는 사용자 정의 네트워크에서 실행되며, 각 서비스는 해당 네트워크를 통해 상호 통신합니다.

볼륨

db_data: MySQL 데이터 저장소

es_data: Elasticsearch 데이터 저장소


로그 및 모니터링

NestJS의 모든 API 로그는 Logstash를 통해 Elasticsearch로 전송되고, Kibana에서 시각화할 수 있습니다. 추가적인 커스텀 필드나 로그 포맷을 설정하려면 logstash.conf 파일을 수정하여 적용할 수 있습니다.

확장 계획

DB: MySQL 외에 PostgreSQL, MongoDB 등의 데이터베이스를 지원할 예정입니다.

메시지 브로커: RabbitMQ, Kafka 등의 메시지 브로커 추가를 고려 중입니다.

인메모리 캐시: Redis 등 캐시 솔루션도 추후 추가될 예정입니다.


기여 방법

1. 레포를 포크합니다.


2. 새로운 브랜치를 생성합니다. (git checkout -b feature/새로운기능)


3. 변경사항을 커밋합니다. (git commit -m '새로운 기능 추가')


4. 브랜치에 푸시합니다. (git push origin feature/새로운기능)


5. 풀 리퀘스트를 생성합니다.



-----
2024-12-13 - 레디스,레드락 초기구성 추가


라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 사항은 LICENSE 파일을 참고하세요.



