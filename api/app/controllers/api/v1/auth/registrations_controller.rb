class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
    after_action :set_token_info, only: [:create]

    private

    def sign_up_params
      params.permit(:email, :password, :password_confirmation)
    end
    
    # 自動で設定されるインスタンス変数にユーザーデータが保存されているか確認し、保存されていれば新しいトークンを作成。
    # ヘッダーに access-token と client を設定
    def set_token_info
        return unless @resource.persisted? 
    
        token = @resource.create_new_auth_token
        response.set_header('access-token', token['access-token'])
        response.set_header('client', token['client'])
    end
    
    def account_update_params
      params.permit(:password, :password_confirmation, :current_password)
    end
end
