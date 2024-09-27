#!/bin/bash

# MySQL에 접속하여 root 사용자 권한 및 비밀번호 설정
mysql - u root - p "$MYSQL_ROOT_PASSWORD" << EOF
-- 원격 접속 허용 및 비밀번호 설정
ALTER USER 'root' @'%' IDENTIFIED
WITH
    mysql_native_password BY '$MYSQL_ROOT_PASSWORD';

-- localhost에서의 비밀번호 설정
ALTER USER 'root' @'localhost' IDENTIFIED
WITH
    mysql_native_password BY '$MYSQL_ROOT_PASSWORD';

-- 권한 테이블 다시 로드하여 즉시 반영
FLUSH PRIVILEGES;

EOF