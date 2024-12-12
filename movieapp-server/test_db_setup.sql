-- Drop existing tables if needed to ensure a clean slate
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS join_request CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS user_group CASCADE;
DROP TABLE IF EXISTS favorite_list_movies CASCADE;
DROP TABLE IF EXISTS favorite_list CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS movie_mappings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate the tables

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie_mappings (
    mapping_id SERIAL PRIMARY KEY,
    local_title VARCHAR(255) NOT NULL,
    release_year INTEGER,
    tmdb_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (local_title, release_year)
);

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    stars INTEGER CHECK (stars BETWEEN 1 AND 5) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tmdb_id) REFERENCES movie_mappings(tmdb_id) ON DELETE CASCADE
);

CREATE TABLE favorite_list (
    favorite_list_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    public BOOLEAN DEFAULT FALSE
);

CREATE TABLE favorite_list_movies (
    favorite_list_id INTEGER REFERENCES favorite_list(favorite_list_id) ON DELETE CASCADE,
    tmdb_id INTEGER REFERENCES movie_mappings(tmdb_id) ON DELETE CASCADE,
    PRIMARY KEY (favorite_list_id, tmdb_id)
);

CREATE TABLE user_group (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    creator_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
    group_id INTEGER REFERENCES user_group(group_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(10) CHECK (role IN ('owner', 'member')) NOT NULL,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE join_request (
    request_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES user_group(group_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(10) CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);