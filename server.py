#!/usr/bin/env python3
import json
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit

HOST_IP = "localhost"
HOST_PORT = "4040"

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins="*")

# @app.route('/send_video')
# def send_video(data):
#     print('app here')
#     return render_template(data)

@app.route('/hello', methods = ['POST'])
def hello():
    print('hello')
    print(request.form)
    print(request.form['hello'])
    return "hello world"

@app.route('/send_video', methods = ['POST'])
def send_video():
    print('app here')
    print(request.data)
    #print(request.form.getlist('fishes'))
    #print(request.form['fishes'])
    #print(request.form['video'])
    #f = request.files['file']
    #print(f)
    #f.save(secure_filename(f.filename))
    return 'file uploaded successfully'

@app.route('/')
def index():
    print('index')
    return render_template('index.html')

@app.route('/', methods=['POST'])
def upload_files():
    print('app2 here')
    # uploaded_file = request.files['file']
    # filename = secure_filename(uploaded_file.filename)
    # if filename != '':
    #     file_ext = os.path.splitext(filename)[1]
    #     if file_ext not in app.config['UPLOAD_EXTENSIONS'] or \
    #             file_ext != validate_image(uploaded_file.stream):
    #         abort(400)
    #     uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
    # return redirect(url_for('index'))

@sio.on('Send Video')
def send_video(data):
    print(data)
    pass

@sio.on('Get Server State')
def get_server_state():
    pass

@sio.on('Get Analysis Video')
def get_analysis_video(token=None):
    pass

@sio.on('Get Analysis Data')
def get_analysis_data(token=None):
    pass

@sio.on('Get Tokens')
def get_tokens() -> list:
    pass


if __name__ == '__main__':
    print('Starting Server')
    sio.run(app, host=HOST_IP, port=HOST_PORT)
