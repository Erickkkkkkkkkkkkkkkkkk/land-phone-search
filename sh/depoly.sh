#!/bin/bash

# 오렌지 색상과 블링크 효과 정의
ORANGE='\033[0;33m'  # 오렌지 색상
BLINK='\033[5m'      # 블링크 효과
RESET='\033[0m'      # 색상 리셋

# 버전명 입력 받기
if [ -z "$1" ]; then
    echo "사용법: $0 {버전명}"
    exit 1
fi

VERSION=$1

# # 빌드 실행
# echo "빌드를 실행하는 중..."
# npm run build

# # 빌드 결과 확인
# if [ $? -ne 0 ]; then
#     echo -e "${BLINK}${ORANGE}빌드 중 오류가 발생했습니다!${RESET}"
#     exit 1
# fi

# git flow release finish 실행
echo "릴리스를 완료하는 중: $VERSION..."
git flow release finish "$VERSION"

# 원격 저장소에 푸시
echo "변경 사항을 원격 저장소에 푸시하는 중..."
git push origin master
git push origin develop
git push --tags



# Vercel 배포
echo "Vercel에 배포하는 중..."
vercel --prod

echo "배포가 완료되었습니다."