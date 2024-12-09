class LogRequestHeaders
    def initialize(app)
      @app = app
    end
  
    def call(env)
      Rails.logger.info "Request Headers: #{env.select { |k, _| k.start_with?('HTTP_') }}"
      @app.call(env)
    end
  end
  