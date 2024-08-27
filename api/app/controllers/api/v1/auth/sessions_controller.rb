class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController

  # ログイン状態の確認
  def index
    if current_user
        render json: {is_login: true, data: current_user }
    else
        render json: {is_login: false, message: "ユーザーが存在しません"}
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
      render_create_error_bad_credentials
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
      render json: { message: 'ログアウトしました。' }
    else
      render json: { errors: ['ログアウトに失敗しました。'] }, status: :unprocessable_entity
    end
  end

end
