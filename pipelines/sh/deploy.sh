set -e

ZIP_PROJECT="app.zip"
SERVER_IP="144.91.108.8"
SERVER_USER="root"
SERVER_PASSWORD="qEM56LfCJQ6apb"
SERVER_FOLDER="/root/app"

echo "[*] delete unneded folders"
#rm -r -f "./backend/node_modules"
rm -r -f "./backend/build"
rm -r -f "./backend/logs"

#rm -r -f "./frontend/node_modules"
rm -r -f "./frontend/build"

echo "[*] zipping project"
rm -r -f "${ZIP_PROJECT}"
zip -r "${ZIP_PROJECT}" . > /tmp/.zipping

echo "[*] uploading project"
ssh "${SERVER_USER}"@"${SERVER_IP}" "rm -r ${SERVER_FOLDER}"
ssh "${SERVER_USER}"@"${SERVER_IP}" "mkdir ${SERVER_FOLDER}"
scp "${ZIP_PROJECT}" "${SERVER_USER}"@"${SERVER_IP}":"${SERVER_FOLDER}"
ssh "${SERVER_USER}"@"${SERVER_IP}" "cd ${SERVER_FOLDER} && unzip ${ZIP_PROJECT} -d ." > /tmp/.unzipping

echo "[*] deploying project"
ssh "${SERVER_USER}"@"${SERVER_IP}" "cd ${SERVER_FOLDER} && cp production.env .env"
ssh "${SERVER_USER}"@"${SERVER_IP}" "cd ${SERVER_FOLDER} && docker-compose -f docker-compose.yml stop"
ssh "${SERVER_USER}"@"${SERVER_IP}" "cd ${SERVER_FOLDER} && docker-compose -f docker-compose.yml up --build -d"
