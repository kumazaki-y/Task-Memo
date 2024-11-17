const AWS = require('aws-sdk');
const mysql = require('mysql2/promise');

// Secrets Manager からデータベース情報を取得
const getDatabaseCredentials = async () => {
  const secretsManager = new AWS.SecretsManager({ region: 'ap-northeast-1' });
  const secretName = 'rds!cluster-0910c2b7-068d-402b-be79-26b168734b92';
  const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  
  
  return JSON.parse(secretValue.SecretString);
};

// RDS に接続して未認証ユーザー削除を実行
exports.handler = async () => {
  try {
    const credentials = await getDatabaseCredentials();
    const { username, password, host, dbname } = credentials;


    const connection = await mysql.createConnection({
      host: host,
      user: username,
      password: password,
      database: dbname,
      port: 3306,
    });

    console.log('Connected to MySQL database');

    // 未認証ユーザーを削除するクエリ
    const query = `
      DELETE FROM users 
      WHERE confirmed_at IS NULL 
        AND confirmation_sent_at < NOW() - INTERVAL 1 DAY;
    `;
    const [result] = await connection.execute(query);

    console.log(`${result.affectedRows} unconfirmed users deleted.`);
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
};
