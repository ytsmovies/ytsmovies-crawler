
echo "Build a dev environment"
echo "======================="

export ROOT_DIR=$1
echo "RootDir ${ROOT_DIR}"

#Install build tools
echo -e "\n*****  0  *****"
pip3 install six oss2 

#Compile app
echo -e "\n*****  1  *****"
$ROOT_DIR/make.sh debug

#Prepare artifacts
echo -e "\n*****  2  *****"
$ROOT_DIR/prepare-artifacts.sh $OSS_TEST_CONFIG_URL

#Upload artifacts
echo -e "\n*****  3  *****"
$ROOT_DIR/process-artifacts.sh $OSS_ACCESS_KEY_ID $OSS_ACCESS_KEY_SECRET $OSS_ENDPOINT $OSS_BUCKET

#Deploy to dev server
echo -e "\n*****  6  *****"
$ROOT_DIR/deploy-dev.sh $DEV_SERVER_URL $DEV_SERVER_USER "${DEV_SERVER_KEY}" $OSS_TEST_APP_URL