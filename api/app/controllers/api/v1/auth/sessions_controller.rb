class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  before_action :set_current_user

  def index
    if @current_user
      render json: { is_login: true, data: @current_user }
    else
      render json: { is_login: false, message: I18n.t('errors.user_not_found') }
    end
  end

  # ログイン処理
  def create
    @resource = User.find_by(email: params[:email])
  
    # ユーザーが存在し、パスワードが正しいか検証
    if @resource && @resource.valid_password?(params[:password])

      @token = @resource.create_token
      @resource.save!
      render_create_success
    else
      # ユーザーが見つからない、またはパスワードが間違っている場合のエラーレスポンス
      render json: { message: I18n.t('errors.invalid_credentials') }, status: :unauthorized
    end
  end

  def guest_sign_in

    # 一時的なユーザーを作成
    guest_user = User.create!(
      email: "guest_#{Time.now.to_i}#{rand(1000)}@example.com",
      password: Devise.friendly_token[0, 20]
    )

    # 作成したユーザーをリソースに格納
    # devise token authに定義されているrender_create_successメソッド内でも使用される
    @resource = guest_user

    # 作成したユーザーにトークンを作成
    @token = @resource.create_token
    @resource.save! 

    # ヘッダーに認証情報を設定しレスポンスを返す
    render_create_success
  end

  def destroy
    # 認証情報を含むヘッダーからトークン情報を取得
    client_id = request.headers['client']
    uid = request.headers['uid']
    access_token = request.headers['access-token']

    user = User.find_by_uid(uid)
    user.tokens.delete(client_id) if user

    if user&.save
      render json: { message: I18n.t('devise.sessions.signed_out') }
    else
      render json: { errors: [I18n.t('errors.logout_failed')] }, status: :unprocessable_entity
    end
  end

  private

  def set_current_user
    @current_user = User.find_by(uid: request.headers['uid'])
  end
end
