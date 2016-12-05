class ChangeFonts < ActiveRecord::Migration
  def change
    add_column :fonts, :file, :binary
  end
end
