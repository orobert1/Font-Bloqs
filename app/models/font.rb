# == Schema Information
#
# Table name: fonts
#
#  id         :integer          not null, primary key
#  path       :string
#  name       :string
#  created_at :datetime
#  updated_at :datetime
#  file       :binary
#

class Font < ActiveRecord::Base
  validates :name, presence: true
  validates :path, presence: true
  after_initialize :ensure_file

  def ensure_file
    str = File.read(self.path)
    self.file = Base64.encode64(str)
  end

end
