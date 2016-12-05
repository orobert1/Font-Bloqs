# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed ( or created alongside the db with db:setup ).
#
# Examples:
#
#  cities = City.create( [{ name: 'Chicago' }, { name: 'Copenhagen' }] )
#  Mayor.create( name: 'Emanuel', city: cities.first )

Font.create({path: "#{Rails.root}/app/assets/fonts/AntiqueCondensedTwo.ttf", name: "Antique"});
Font.create({path: "#{Rails.root}/app/assets/fonts/ApresRE-Bold.ttf", name: "ApresRE"});
Font.create({path: "#{Rails.root}/app/assets/fonts/benton.ttf", name: "Benton"});
