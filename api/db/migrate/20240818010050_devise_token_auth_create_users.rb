class DeviseTokenAuthCreateUsers < ActiveRecord::Migration[7.1]
  def change
    change_table(:users) do |t|
      ## Required
      # t.string :uid, null: false, default: ""
      # t.string :provider, null: false, default: "email"

      ## Tokens
      t.text :tokens

      ## User Info
      t.string :name
      t.string :nickname
      t.string :image
      # t.string :email

      # t.timestamps
    end

    # add_index :users, :email, unique: true
    # add_index :users, [:uid, :provider], unique: true
  end
end
