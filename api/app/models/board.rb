class Board < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

end
