# starter_pack_back

nestJS 백엔드 초기환경구성

/starter_pack_back/docker
sudo docker-compose down
sudo docker-compose up --build

초기환경구성 이후
docker-compose restart

# 마운트된 DB설정에 수정사항이 생겼을때 볼륨을 백업한 이후 해당 볼륨을 초기화하거나 다른곳에 볼륨을 재구성해야합니다.

sudo docker-compose down --volumes

# 도커 이미지를 새로 빌드 (캐시 사용 안 함)

sudo docker-compose build --no-cache

# 컨테이너 시작

sudo docker-compose up -d
