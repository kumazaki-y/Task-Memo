class Api::V1::Auth::PasswordsController < DeviseTokenAuth::PasswordsController
    respond_to :json
    before_action :configure_permitted_parameters
  
    private
  
    def respond_with(resource, _opts = {})
    if resource.nil?
      # ユーザーが見つからなかった場合
      reset_password_user_not_found
    elsif resource.persisted?
      # パスワードリセットが成功した場合
      reset_password_success
    else
      # パスワードリセットが失敗した場合
      reset_password_failed
    end
    end
  
    def send_reset_mail_success
      render json: { message: 'Send Reset Mail successfully.' }
    end
  
    def reset_password_success
      render json: { message: 'Password Reset successfully.' }
    end
  
    def reset_password_failed
      render json: { message: I18n.t('errors.password_reset_failed') }
    end

    
    protected

    def configure_permitted_parameters
    # create アクションで email, redirect_url, password を許可
    devise_parameter_sanitizer.permit(:create, keys: [:email, :redirect_url, :password])
    
    # edit アクションで redirect_url と config を許可
    devise_parameter_sanitizer.permit(:edit, keys: [:email, :config, :redirect_url])
    end

    def reset_password_user_not_found
      render json: { error: I18n.t('errors.user_not_found') }, status: :not_found
    end
    
  end