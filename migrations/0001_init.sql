-- ================================================================
-- 위드엔딩 (Memorial Castle) 데이터베이스 초기 스키마
-- ================================================================

-- 1. 회원 테이블
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    UNIQUE NOT NULL,
  password   TEXT    NOT NULL,          -- bcrypt 해시 (실제 배포 시 변경)
  name       TEXT    NOT NULL,
  phone      TEXT    DEFAULT '',
  role       TEXT    DEFAULT 'user',    -- 'user' | 'admin'
  is_active  INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 게시판 카테고리 테이블
CREATE TABLE IF NOT EXISTS board_categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active  INTEGER DEFAULT 1
);

-- 3. 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  user_id     INTEGER NOT NULL,
  title       TEXT    NOT NULL,
  content     TEXT    NOT NULL,
  is_notice   INTEGER DEFAULT 0,   -- 공지사항 여부
  is_private  INTEGER DEFAULT 0,   -- 비밀글 여부
  view_count  INTEGER DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES board_categories(id),
  FOREIGN KEY (user_id)     REFERENCES users(id)
);

-- 4. 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id    INTEGER NOT NULL,
  user_id    INTEGER NOT NULL,
  content    TEXT    NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id)  REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)
);

-- 5. 상담신청 테이블 (기존 /api/contact 데이터 저장)
CREATE TABLE IF NOT EXISTS consultations (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT DEFAULT '',
  service_type TEXT DEFAULT '',    -- 장례/멤버십/자산관리 등
  message      TEXT DEFAULT '',
  status       TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'done'
  user_id      INTEGER DEFAULT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ================================================================
-- 기본 데이터 삽입
-- ================================================================

-- 게시판 카테고리 기본값
INSERT OR IGNORE INTO board_categories (name, slug, description, sort_order) VALUES
  ('공지사항',   'notice',     '위드엔딩 공지사항',        1),
  ('자유게시판', 'free',       '자유롭게 글을 남겨주세요',  2),
  ('상담후기',   'review',     '서비스 이용 후기',          3),
  ('웰다잉 이야기', 'welldying', '웰다잉·장례 관련 이야기', 4);

-- 관리자 계정 (비밀번호: admin1234 — sha256 해시)
-- 실제 운영 시 반드시 변경하세요
INSERT OR IGNORE INTO users (email, password, name, role) VALUES
  ('admin@withendings.co.kr',
   'a6568e5ce7a33a9618374e3e74c0c7c4e1b45f1a8e3d2f5c9b0e7a4d1f6c8b2',
   '관리자', 'admin');

-- 환영 공지 게시글
INSERT OR IGNORE INTO posts (category_id, user_id, title, content, is_notice) VALUES
  (1, 1,
   '위드엔딩 커뮤니티에 오신 것을 환영합니다 🌿',
   '안녕하세요. 위드엔딩 메모리얼캐슬입니다.\n\n이 공간은 여러분이 자유롭게 이야기를 나누고, 서비스 후기를 남기며, 웰다잉에 대해 함께 생각하는 공간입니다.\n\n궁금한 점은 언제든지 24시간 상담을 이용해 주세요.',
   1);
