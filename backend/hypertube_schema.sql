-- =============================================
-- Hypertube Database Schema
-- =============================================

-- Users
CREATE TABLE users (
    id              VARCHAR(36)   PRIMARY KEY,
    username        VARCHAR(50)   NOT NULL UNIQUE,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255),
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    profile_picture_url VARCHAR(500),
    preferred_language  VARCHAR(10) DEFAULT 'en',
    oauth_provider  VARCHAR(50),
    oauth_uid       VARCHAR(255),
    oauth_access_token  VARCHAR(500),
    oauth_refresh_token VARCHAR(500),
    password_reset_token    VARCHAR(255),
    password_reset_expires  TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies
CREATE TABLE movies (
    id              VARCHAR(36)   PRIMARY KEY,
    title           VARCHAR(255)  NOT NULL,
    imdb_id         VARCHAR(20)   UNIQUE,
    imdb_rating     DECIMAL(3,1),
    production_year INT,
    length_minutes  INT,
    genre           VARCHAR(100),
    summary         TEXT,
    cover_image_url VARCHAR(500),
    director        VARCHAR(255),
    producer        VARCHAR(255),
    cast_list       TEXT,
    torrent_hash    VARCHAR(255),
    torrent_magnet  TEXT,
    file_path       VARCHAR(500),
    is_downloaded   BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP,
    downloaded_at   TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subtitles
CREATE TABLE subtitles (
    id              VARCHAR(36)   PRIMARY KEY,
    movie_id        VARCHAR(36)   NOT NULL,
    language_code   VARCHAR(10)   NOT NULL,
    file_path       VARCHAR(500),
    source_url      VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE comments (
    id              VARCHAR(36)   PRIMARY KEY,
    movie_id        VARCHAR(36)   NOT NULL,
    user_id         VARCHAR(36)   NOT NULL,
    username        VARCHAR(50)   NOT NULL,
    content         TEXT          NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);

-- Watched Videos
CREATE TABLE watched_videos (
    id              VARCHAR(36)   PRIMARY KEY,
    user_id         VARCHAR(36)   NOT NULL,
    movie_id        VARCHAR(36)   NOT NULL,
    watched_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, movie_id),
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- API Clients (OAuth2)
CREATE TABLE api_clients (
    id                  VARCHAR(36)   PRIMARY KEY,
    user_id             VARCHAR(36)   NOT NULL,
    client_id           VARCHAR(255)  NOT NULL UNIQUE,
    client_secret_hash  VARCHAR(255)  NOT NULL,
    name                VARCHAR(100),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API Access Tokens (OAuth2)
CREATE TABLE api_tokens (
    id          VARCHAR(36)   PRIMARY KEY,
    client_id   VARCHAR(36)   NOT NULL,
    user_id     VARCHAR(36)   NOT NULL,
    token_hash  VARCHAR(255)  NOT NULL UNIQUE,
    scope       VARCHAR(255),
    expires_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES api_clients(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)       ON DELETE CASCADE
);

-- =============================================
-- Indexes
-- =============================================
-- CREATE INDEX idx_users_email         ON users(email);
-- CREATE INDEX idx_users_username      ON users(username);
-- CREATE INDEX idx_movies_imdb_id      ON movies(imdb_id);
-- CREATE INDEX idx_movies_last_watched ON movies(last_watched_at);
-- CREATE INDEX idx_comments_movie_id   ON comments(movie_id);
-- CREATE INDEX idx_comments_user_id    ON comments(user_id);
-- CREATE INDEX idx_watched_user_movie  ON watched_videos(user_id, movie_id);
-- CREATE INDEX idx_api_tokens_hash     ON api_tokens(token_hash);
-- CREATE INDEX idx_api_clients_id      ON api_clients(client_id);

