#! /bin/bash
echo "[INFO] Preparing Backend infrastructure ................"
cd backend/
cat .env.example >> .env
echo -e  >> .env
echo -e FRONTEND_URL=$(gp url 3000) >> .env
npm i
docker-compose up --build -d
npm run swagger:ts
echo "[INFO] Preparing Backend infrastructure done."

echo \n\n\n

echo "[INFO] Preparing Frontend infrastructure ................"
cd ../frontend/
cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
cat .env.example >> .env
echo -e  >> .env
echo -e VITE_BASE_URL=$(gp url 6001) >> .env
npm i
docker-compose --profile dev up --build -d
echo "[INFO] Preparing Backend infrastructure done."

echo \n\n\n


echo "[INFO] Preparing Mobile App infrastructure ................"
cd ../vanlog
cp -f ../backend/src/api/myApi.ts ./src/api/myApi.ts
cat .env.example >> .env
echo -e  >> .env
echo -e EXPO_PUBLIC_API_URL=$(gp url 6001) >> .env
npm i
npx expo login
npx expo start --tunnel -c