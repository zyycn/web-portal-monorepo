# 使用 node 镜像进行构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 monorepo 的 package.json 和 pnpm-lock.yaml/yarn.lock
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
COPY @app ./@app

# 安装依赖
RUN npm install -g pnpm && pnpm install

# 遍历 @app 下的所有项目并打包
RUN for dir in $(ls -d @app/*/); do \
  cd $dir && \
  if [ -f package.json ]; then \
    pnpm install && pnpm run build; \
  fi; \
  cd /app; \
    done

# 使用 nginx 镜像部署
FROM nginx:alpine

# 清空默认 nginx 静态目录
RUN rm -rf /usr/share/nginx/html/*

# 复制所有打包后的静态文件到 nginx 目录
COPY --from=builder /app/@app/*/dist/ /usr/share/nginx/html/

# 可选：自定义 nginx 配置
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]