# ベースイメージを指定
FROM ruby:3.3.4

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    nodejs \
    yarn \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /myapp

# GemfileとGemfile.lockをコピーして依存関係をインストール
COPY Gemfile Gemfile.lock /myapp/
RUN bundle install

# アプリケーションのファイルをコピー
COPY . /myapp

# entrypoint.shのコピーと実行権限の付与
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# エントリーポイントの設定
ENTRYPOINT ["entrypoint.sh"]

# ポートのエクスポート
EXPOSE 3000

# Railsサーバーの起動コマンド
CMD ["rails", "server", "-b", "0.0.0.0"]