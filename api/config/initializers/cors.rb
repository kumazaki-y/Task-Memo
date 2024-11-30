# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.production?
      origins "https://api.task-memo.com", 
              "https://www.task-memo.com", 
              "https://reclaim-time.vercel.app",
              /https:\/\/.*\.vercel\.app/ # Vercelのすべてのサブドメインを許可
    else
      origins "http://localhost:5173"  # 開発用
    end
    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      expose: ["access-token", "expiry", "token-type", "uid", "client"]
  end
end
