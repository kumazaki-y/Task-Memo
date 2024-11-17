class User < ApplicationRecord
  before_create :set_allow_password_change
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
         scope :unconfirmed_and_expired, -> {
          where('confirmed_at IS NULL AND confirmation_sent_at < ?', Devise.confirm_within.ago)
        }
  include DeviseTokenAuth::Concerns::User

  # ユーザーがログイン認証しているかを判定
  def token_validation_response
    as_json(except: %i[tokens created_at updated_at]).merge(confirmed_at: self.confirmed_at)
  end

  private

  def set_allow_password_change
    self.allow_password_change = false
  end

  has_many :boards, dependent: :destroy

end