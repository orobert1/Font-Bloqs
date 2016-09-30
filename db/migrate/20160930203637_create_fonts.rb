class CreateFonts < ActiveRecord::Migration
  def change
    create_table :fonts do |t|
      t.string :path
      t.string :name
      t.timestamps
    end
  end
end
