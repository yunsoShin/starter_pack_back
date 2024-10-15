cd /home/project/...폴더

git pull origin main
if [ $? -ne 0 ]; then
  echo "git pull 실패"
  exit 1
fi

# Docker Compose로 서비스 재빌드 및 재시작
docker-compose -f /home/project/폴더이름/docker/docker-compose.yml down
docker-compose -f /home/project/폴더이름/docker/docker-compose.yml up --build -d

if [ $? -ne 0 ]; then
  echo "Docker Compose 실행 중 오류 발생"
  exit 1
fi

echo "배포 완료"
