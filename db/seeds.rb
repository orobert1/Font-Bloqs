# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed ( or created alongside the db with db:setup ).
#
# Examples:
#
#  cities = City.create( [{ name: 'Chicago' }, { name: 'Copenhagen' }] )
#  Mayor.create( name: 'Emanuel', city: cities.first )

Font.create({path: "#{Rails.root}/app/assets/fonts/Agenda-Black.ttf", name: "Agenda Black"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Agenda-Bold.ttf", name: "Agenda Bold"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Agenda-Medium.ttf", name: "Agenda Medium"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Agenda-Light.ttf", name: "Agenda Light"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Agenda-ThinUltraCondensed.ttf", name: "Agenda Thin Ultra Condensed"});

Font.create({path: "#{Rails.root}/app/assets/fonts/Benton Gothic Black.ttf", name: "Benton Gothic Black"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Benton Gothic Bold.ttf", name: "Benton Gothic Bold"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Benton Gothic Regular.ttf", name: "Benton Gothic Regular"});

Font.create({path: "#{Rails.root}/app/assets/fonts/DIN Next LT W23 Black.ttf", name: "DIN Next LT W23 Black"});
Font.create({path: "#{Rails.root}/app/assets/fonts/DIN Next LT W23 Bold.ttf", name: "DIN Next LT W23 Bold"});
Font.create({path: "#{Rails.root}/app/assets/fonts/DIN Next LT W23 Heavy.ttf", name: "DIN Next LT W23 Heavy"});
Font.create({path: "#{Rails.root}/app/assets/fonts/DIN Next LT W23 Medium.ttf", name: "DIN Next LT W23 Medium"});
Font.create({path: "#{Rails.root}/app/assets/fonts/DIN Next LT W23 Regular.ttf", name: "DIN Next LT W23 Regular"});
Font.create({path: "#{Rails.root}/app/assets/fonts/DIN Next LT W23 Light.ttf", name: "DIN Next LT W23 Light"});

Font.create({path: "#{Rails.root}/app/assets/fonts/Linotype Univers 820 Black Condensed.ttf", name: "Linotype Univers 820 Black Condensed"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Linotype Univers 620 Bold Condensed.ttf", name: "Linotype Univers 620 Bold Condensed"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Linotype Univers 720 Heavy Condensed.ttf", name: "Linotype Univers 720 Heavy"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Linotype Univers 530 Medium.ttf", name: "Linotype Univers 530 Medium"});
Font.create({path: "#{Rails.root}/app/assets/fonts/Linotype Univers 330 Light.ttf", name: "Linotype Univers 330 Light"});
