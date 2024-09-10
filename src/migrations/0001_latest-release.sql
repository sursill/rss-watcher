-- Migration number: 0001 	 2024-09-04T19:56:19.974Z
DROP TABLE IF EXISTS latest_release;
CREATE TABLE IF NOT EXISTS latest_release (id INTEGER PRIMARY KEY, version TEXT, published_at DATETIME, updated_at DATETIME);
INSERT INTO latest_release (id, version, published_at, updated_at) VALUES (1, '1.0.0', '2020-01-01 08:00:00', '2020-01-01 08:00:00');
