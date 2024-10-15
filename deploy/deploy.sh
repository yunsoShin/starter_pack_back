#!/bin/bash

# 프로젝트 폴더로 이동
cd /home/project/폴더이름

# Git pull 실행
git pull origin main
if [ $? -ne 0 ]; then
  echo "git pull 실패"
  exit 1
fi

# backend 폴더로 이동
cd /home/project/폴더이름/backend

# npm install 실행
npm install
if [ $? -ne 0 ]; then
  echo "npm install 실패"
  exit 1
fi

# 마이그레이션 코드 생성 (db:generate)
npm run db:generate
if [ $? -ne 0 ]; then
  echo "db:generate 실행 실패"
  exit 1
fi

# 마이그레이션 코드 생성 (db:generate)
npm run db:run
if [ $? -ne 0 ]; then
  echo "db:run 실행 실패"
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
