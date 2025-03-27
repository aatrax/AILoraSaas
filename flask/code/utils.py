from flask import Flask, request, jsonify
import jwt
from functools import wraps
import datetime
app = Flask(__name__)

# 加载公私钥
with open('flask/private.pem', 'r') as f:
    private_key = f.read()

with open('flask/public_key.pem', 'r') as f:
    public_key = f.read()

fake_emails = {
    "user1": {"password": "password123"},
    "user2": {"password": "mypassword"}
}

# 创建一个装饰器函数来验证 token
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        # 检查请求头中的 Authorization 是否有传递 token
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # "Bearer token"

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403  # 没有 token 时返回错误

        try:
            # 解码 token，验证它的有效性
            data = jwt.decode(token, public_key, algorithms=["RS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        # 将当前用户传递给后续的视图函数
        return f(*args, **kwargs)

    return decorated_function

def generate_key(user_id):
    token = jwt.encode({'user_id': user_id, 'exp': datetime.datetime.now() + datetime.timedelta(minutes=30)}, private_key, algorithm="RS256")
    return token