cd client
ng build
cd ..
docker build -t chainopoly -f docker/Dockerfile .
