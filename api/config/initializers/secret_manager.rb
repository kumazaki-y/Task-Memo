require 'aws-sdk-secretsmanager'

def get_secret
  return unless Rails.env.production? # 本番環境以外ではSecrets Managerを使わない

  region_name = "ap-northeast-1"
  
  # Secrets Managerクライアントを作成
  client = Aws::SecretsManager::Client.new(region: region_name)

  # データベース用のシークレット取得
  begin
    db_secret_name = "rds!cluster-0910c2b7-068d-402b-be79-26b168734b92"
    db_response = client.get_secret_value(secret_id: db_secret_name)
    db_secret = JSON.parse(db_response.secret_string)

    # データベース接続情報を環境変数に設定
    ENV['MYAPP_DATABASE_PASSWORD'] = db_secret['password']
    ENV['MYAPP_DATABASE_USER'] = db_secret['username']
    ENV['MYAPP_DATABASE_HOST'] = 'task-memo-database-1-instance-1.c3euqkm8slao.ap-northeast-1.rds.amazonaws.com'
    ENV['MYAPP_DATABASE_NAME'] = 'task_memo_db'
    
  rescue Aws::SecretsManager::Errors::ServiceError => e
    puts "Error retrieving database secret: #{e}"
  end

  # SECRET_KEY_BASE用のシークレット取得
  begin
    secret_key_base_name = "task-memo.com_SECRET_KEY_BASE" 
    secret_key_base_response = client.get_secret_value(secret_id: secret_key_base_name)
    secret_key_base_secret = JSON.parse(secret_key_base_response.secret_string)

    # SECRET_KEY_BASEを環境変数に設定
    ENV['SECRET_KEY_BASE'] = secret_key_base_secret['secret_key_base'] # Railsのシークレットキー

  rescue Aws::SecretsManager::Errors::ServiceError => e
    puts "Error retrieving SECRET_KEY_BASE: #{e}"
  end
end

# シークレットを取得して環境変数に設定
get_secret
