-- Insert initial raags
INSERT INTO raags (name, description, mood, category, aroha, avaroha, vadi, samvadi, time_period) VALUES
('Bhairav', 'Ancient and sacred raag, often performed in temples', 'devotional', 'classical', 'sa re ma pa dha ni sa', 'sa ni dha pa ma ga re sa', 'ma', 'sa', 'early morning'),
('Yaman', 'Sweet and pleasant raag, brings joy and celebration', 'romantic', 'classical', 'sa ga ma dha ni sa', 'sa ni dha ma ga re sa', 'dha', 'sa', 'evening'),
('Bhairavī', 'Serious and contemplative raag with devotional essence', 'devotional', 'bhajan', 'sa re ga ma pa dha ni sa', 'sa ni dha pa ma ga re sa', 'ga', 'sa', 'morning'),
('Jog', 'Deep and meditative raag, expresses sorrow and longing', 'sad', 'classical', 'sa dha ni sa ga ma pa dha ni sa', 'sa ni dha pa ma ga re sa', 'pa', 'sa', 'evening'),
('Kafi', 'Soft and gentle raag, romantic and devotional feelings', 'romantic', 'bhajan', 'sa re ga ma pa dha sa', 'sa ni dha pa ma ga re sa', 'dha', 'sa', 'afternoon'),
('Marwa', 'Energetic and powerful raag, brings patriotic spirit', 'patriotic', 'classical', 'sa ma pa dha ni sa', 'sa ni dha pa ma ga sa', 'dha', 'ma', 'evening'),
('Sarang', 'Classical raag with complex melodic movement', 'classical', 'classical', 'sa ga ma pa dha ni sa', 'sa ni dha pa ma ga sa', 'pa', 'sa', 'afternoon')
ON CONFLICT (name) DO NOTHING;

-- Insert initial instruments
INSERT INTO instruments (name, description, category) VALUES
('Harmonium', 'Traditional Indian keyboard instrument, widely used in classical music', 'keyboard'),
('Violin', 'String instrument adapted for Indian classical music', 'string'),
('Sitar', 'Plucked string instrument with distinctive resonance', 'string'),
('Sarangi', 'Bowed string instrument with rich, soulful tone', 'string'),
('Bansuri', 'Traditional bamboo flute, associated with Lord Krishna', 'wind'),
('Shehnai', 'Double-reed wind instrument with bright, penetrating tone', 'wind'),
('Tabla', 'Pair of hand drums providing rhythm', 'percussion'),
('Mridangam', 'Double-headed drum with complex tonal variations', 'percussion'),
('Flute', 'Western flute adapted for Indian classical music', 'wind')
ON CONFLICT (name) DO NOTHING;

-- Insert initial mood keywords
INSERT INTO mood_keywords (keyword, mood, weight, language) VALUES
('प्यार', 'romantic', 1.5, 'hindi'),
('प्रेम', 'romantic', 1.5, 'hindi'),
('दिल', 'romantic', 1.0, 'hindi'),
('खुशी', 'romantic', 1.0, 'hindi'),
('उदास', 'sad', 1.5, 'hindi'),
('दुःख', 'sad', 1.5, 'hindi'),
('रो', 'sad', 1.2, 'hindi'),
('भगवान', 'devotional', 1.5, 'hindi'),
('माता', 'devotional', 1.5, 'hindi'),
('देश', 'patriotic', 1.5, 'hindi'),
('राष्ट्र', 'patriotic', 1.5, 'hindi'),
('भारत', 'patriotic', 1.2, 'hindi'),
('स्वतंत्र', 'patriotic', 1.5, 'hindi'),
('इश्क', 'gazal', 1.5, 'hindi'),
('शायरी', 'gazal', 1.0, 'hindi')
ON CONFLICT (keyword, mood, language) DO NOTHING;
