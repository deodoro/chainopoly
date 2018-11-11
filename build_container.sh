cd client
npx ng build
cd ..
docker build -t chainopoly -f docker/Dockerfile .
