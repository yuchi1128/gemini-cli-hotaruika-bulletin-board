
-- forecasts table
CREATE TABLE forecasts (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    prediction VARCHAR(50) NOT NULL, -- なし, プチ湧き, チョイ湧き, 湧き, 爆湧き
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL DEFAULT '名無しさん',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- replies table
CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL DEFAULT '名無しさん',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- likes table
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (post_id) -- To keep it simple, one like per post
);

-- Insert sample data
INSERT INTO forecasts (date, location, prediction) VALUES
(CURRENT_DATE, '富山湾', 'プチ湧き'),
(CURRENT_DATE + 1, '富山湾', 'チョイ湧き'),
(CURRENT_DATE + 2, '富山湾', '湧き'),
(CURRENT_DATE + 3, '富山湾', '爆湧き'),
(CURRENT_DATE + 4, '富山湾', 'なし'),
(CURRENT_DATE + 5, '富山湾', 'プチ湧き'),
(CURRENT_DATE + 6, '富山湾', 'チョイ湧き');

INSERT INTO posts (username, content) VALUES
('富山のホタルイカハンター', '今日の浜辺はすごい人だった！でも、その分たくさん見れたよ！'),
('観光客A', '初めて見に来ました！感動です！');

INSERT INTO replies (post_id, username, content) VALUES
(1, '地元民', '本当ですか！明日の夜、行ってみようかな。');

INSERT INTO likes (post_id) VALUES (1), (2);
