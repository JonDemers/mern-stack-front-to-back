#!/bin/bash

docker build --no-cache --tag com.opcode.mern-stack-front-to-back .

tag=latest-$(date "+%Y.%m.%d-%H.%M.%S")

#docker login -u $DOCKER_CREDENTIAL_USR -p $DOCKER_CREDENTIAL_PSW http://debian-cloud-test:8083

docker tag com.opcode.mern-stack-front-to-back docker-registry.k8s.lan/com.opcode.mern-stack-front-to-back:$tag

docker push docker-registry.k8s.lan/com.opcode.mern-stack-front-to-back:$tag

cat k8s.yml | sed -r "s/\{\{image_version\}\}/$tag/g" | kubectl apply -f -
