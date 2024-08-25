class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController

  
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
