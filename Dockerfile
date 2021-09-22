FROM node:12-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && apk update

RUN apk --no-cache add lftp \
  openssh-client \
  ca-certificates \
  bash 
  
RUN adduser -D -g kubesphere -u 1002 kubesphere && \
    mkdir -p /opt/kubesphere/console && \
    chown -R kubesphere:kubesphere /opt/kubesphere/console
WORKDIR /opt/kubesphere/console
COPY . /opt/kubesphere/console
RUN mv dist/server.js server/server.js
USER kubesphere
EXPOSE 8000
CMD ["npm", "run", "serve"]