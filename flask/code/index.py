# app.py
import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from utils import *
# from celery import Celery

app = Flask(__name__)
CORS(app)  # 处理跨域请求

# # 配置设置
app.config.update(
    UPLOAD_FOLDER='data/uploads',
    CELERY_BROKER_URL='redis://localhost:6379/0',
    CELERY_RESULT_BACKEND='redis://localhost:6379/1',
)


# # 初始化Celery
# celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
# celery.conf.update(app.config)

# 内存存储任务状态（生产环境建议使用数据库）
tasks_db = {}

fake_emails = {
    "user1": {
        "password": "password123",
        "username": "User One",
        "phone": "123-456-7890",
        "coins": 100
    },
    "user2": {
        "password": "mypassword",
        "username": "User Two",
        "phone": "987-654-3210",
        "coins": 50
    }
}

@app.route('/api/train_token', methods=['POST'])
@token_required
def protected_route():
    return jsonify({'message': f'Welcome'})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # 验证用户是否存在
    user = fake_emails.get(email)
    if not user or user["password"] != password:
        return jsonify({"msg": "Invalid username or password"}), 401

    # 创建 JWT 令牌
    access_token = generate_key(user_id=email)
    print("success")
    return jsonify({
        "access_token": access_token,
        "username": user["username"],
        "phone": user["phone"],
        "coins": user["coins"]
    })

# 确保上传目录存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

class TrainingTask:
    def __init__(self, task_id):
        self.task_id = task_id
        self.status = "pending"  # pending | uploading | training | completed | error
        self.progress = 0
        self.message = ""
        
    def to_dict(self):
        return {
            "task_id": self.task_id,
            "status": self.status,
            "progress": self.progress,
            "message": self.message
        }

@app.route('/api/upload', methods=['POST'])
@jwt_required
def upload_files():
    """处理文件上传并创建训练任务"""
    try:
        # 生成唯一任务ID
        task_id = str(uuid.uuid4())
        task = TrainingTask(task_id)
        tasks_db[task_id] = task
        
        # 获取上传文件
        if 'images' not in request.files:
            return jsonify({"error": "未上传文件"}), 400
            
        files = request.files.getlist('images')
        
        # 创建任务目录
        task_dir = os.path.join(app.config['UPLOAD_FOLDER'], task_id)
        os.makedirs(task_dir, exist_ok=True)
        
        # 保存文件
        task.status = "uploading"
        total_files = len(files)
        for idx, file in enumerate(files):
            if file.filename == '':
                continue
            print(f"Uploading {file.filename} ({idx+1}/{total_files})")
            file_path = os.path.join(task_dir, os.path.basename(file.filename))
            
            file.save(file_path)
            
            # 更新上传进度
            task.progress = int((idx + 1) / total_files * 100)
            task.message = f"已上传 {idx+1}/{total_files} 文件"
        
        # 启动训练任务
        task.status = "training"
        task.progress = 0
        task.message = "初始化训练环境"
        # start_training.delay(task_id)
        
        return jsonify({"task_id": task_id})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/training-status/<task_id>', methods=['GET'])
def get_training_status(task_id):
    """获取训练任务状态"""
    task = tasks_db.get(task_id)
    if not task:
        return jsonify({"error": "任务不存在"}), 404
    return jsonify(task.to_dict())

# 模拟任务状态（实际应用中可以存储在数据库）
tasks = {
    1: {"id": 1, "name": "风格训练任务 #1", "progress": 80, "status": "running"},
    2: {"id": 2, "name": "风格训练任务 #2", "progress": 100, "status": "completed"},
}

@app.route('/api/task/<int:task_id>', methods=['GET'])
def get_task_status(task_id):
    task = tasks.get(task_id)
    if task:
        return jsonify(task)
    else:
        return jsonify({"error": "任务不存在"}), 404

# @celery.task(bind=True)
def start_training(self, task_id):
    """Celery 训练任务"""
    task = tasks_db[task_id]
    
    try:
        # 模拟训练过程
        task.message = "准备训练数据"
        for i in range(1, 101):
            # 实际训练步骤应在此处实现
            # train_lora_model(task_id, i)
            
            # 更新任务状态
            task.progress = i
            task.message = f"训练进度 {i}%"
            
            # 模拟处理时间
            self.update_state(state='PROGRESS', meta={'progress': i})
            time.sleep(0.5)
            
        task.status = "completed"
        task.message = "训练完成"
        
    except Exception as e:
        task.status = "error"
        task.message = str(e)
        raise self.retry(exc=e, countdown=5)

def train_lora_model(task_id, progress):
    """实际训练逻辑（示例）"""
    # 在此实现真实的LoRA训练逻辑
    # 使用 task_id 获取上传的文件路径
    # 更新训练进度到 tasks_db[task_id]
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)