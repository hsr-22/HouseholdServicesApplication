class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 300


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///household.sqlite3"
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECRET_KEY = "household"
    SECURITY_PASSWORD_SALT = "householddev"
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    SECURITY_LOGIN_URL = "/login"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3


class CeleryConfig:
    broker_url = "redis://localhost:6379/0"
    result_backend = "redis://localhost:6379/1"
    timezone = "Asia/Kolkata"
    broker_connection_retry_on_startup = True
    # task_ignore_result = False
