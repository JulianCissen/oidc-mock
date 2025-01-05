cd packages/frontend
start sh -c "npm run dev"
cd ../backend
start sh -c "npm run dev"
cd ../..

docker build -t oidc-mock .
docker run -p 8080:8080 oidc-mock
