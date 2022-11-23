# mern-stack-front-to-back

## Deploy secrets to k8s

source .env

kubectl delete secret mern-stack-front-to-back-secret --ignore-not-found

kubectl create secret generic mern-stack-front-to-back-secret \
  "--from-literal=MONGO_URI=$MONGO_URI" \
  "--from-literal=JWT_SECRET=$JWT_SECRET" \
  "--from-literal=GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID" \
  "--from-literal=GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET"
