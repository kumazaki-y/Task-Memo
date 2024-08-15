class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.references :board, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.date :due_date
      t.integer :time_reduction_amount, null: false
      t.string :time_reduction_period, null: false
      t.boolean :is_completed, default: false
      t.timestamps
    end
  end
end
