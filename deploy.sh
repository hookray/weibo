#!/bin/sh

#安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh

sh get-docker.sh

# 建立NginxProxyManager文件夹
mkdir -p NginxProxyManager

# 在NginxProxyManager文件夹下建立docker-compose.yml文件
echo "version: '3'
name: 'npm'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    network_mode: 'host'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt" > NginxProxyManager/docker-compose.yml

# 进入NginxProxyManager文件夹
cd NginxProxyManager

# 启动NginxProxyManager
docker compose up -d

# 回到根目录
cd ~

# 安装NodeJs
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install -y nodejs

# 安装Yarn
npm install -g yarn

# 安装pm2 typescript ts-node nodemon
npm install -g pm2 typescript ts-node nodemon

# 建立weibo文件夹
mkdir -p weibo