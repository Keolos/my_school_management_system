-- Seed classes
insert into classes (name, level_code) values
('KG','KG'),
('Primary 1','P1'),
('Primary 2','P2'),
('Primary 3','P3'),
('Primary 4','P4'),
('Primary 5','P5'),
('Primary 6','P6'),
('JHS 1','JHS1'),
('JHS 2','JHS2'),
('JHS 3','JHS3'),
('SHS 1','SHS1'),
('SHS 2','SHS2'),
('SHS 3','SHS3')
on conflict (name) do nothing;

-- Seed common subjects (example)
insert into subjects (code, name, level_target) values
('ENG','English','Primary,JHS,SHS'),
('MAT','Mathematics','Primary,JHS,SHS'),
('SCI','General Science','Primary,JHS'),
('SST','Social Studies','Primary,JHS'),
('GHL','Ghanaian Language','Primary'),
('RME','Religious & Moral Education','Primary,JHS'),
('ICT','ICT','JHS,SHS'),
('BE','Basic Design & Technology','JHS,SHS'),
('PE','Physical Education','Primary,JHS,SHS'),
('AGR','Agriculture','SHS'),
('ECON','Economics','SHS'),
('BIO','Biology','SHS'),
('CHEM','Chemistry','SHS'),
('PHY','Physics','SHS')
on conflict (code) do nothing;
