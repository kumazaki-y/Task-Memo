FROM node:20.16.0

# 作業ディレクトリの設定
RUN mkdir /myapp
WORKDIR /myapp

# 依存関係のインストール
COPY package.json yarn.lock ./
RUN yarn install

# アプリケーションをDockerコンテナにコピー
COPY . .

CMD ["yarn", "dev"]