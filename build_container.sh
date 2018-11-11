cd client
npx ng build --configuration production --base-href /chainopoly/
cd ..
docker build -t chainopoly -f docker/Dockerfile .
