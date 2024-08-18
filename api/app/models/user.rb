class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :confirmable, :omniauthable

  # DeviseTokenAuthのモジュールをインクルード
  include DeviseTokenAuth::Concerns::User
end
