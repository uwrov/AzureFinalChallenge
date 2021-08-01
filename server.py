#!/usr/bin/env python3
import json
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit
from analysis import *
import pandas as pd
import base64
import ast

HOST_IP = "0.0.0.0"
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
    print("received video")
    info = request.data
    info = info.decode('utf-8')
    info = ast.literal_eval(info)

    idx = len('data:video/mp4;base64,')
    video_str = info['video'][idx:]
    with open('video.mp4', 'wb') as f:
        f.write(base64.b64decode(video_str))

    fish_dict = {'Bermuda Chub': 'b-chub',
                   'Hogfish': 'hogfish',
                   'Sergeant Major': 's-major',
                   'Striped Parrotfish': 's-parrotfish',
                   'Yellow Stingray': 'y-stingray'}
    fish_filter = set()
    for fish in info['fishes']:
        if fish in fish_dict:
            fish_filter.add(fish_dict[fish])

    print("video analysis starting")
    detections = detect_video('video.mp4', 'out.mp4', fish_filter)
    d = filter_results(detections)

    print("video analysis finished, packaging data for return")
    pd.DataFrame(d).transpose().rename(columns={0:"fish type", 1:"timestamp"}).to_csv('test_out.csv')
    dets = pd.read_csv("test_out.csv", index_col=0)

    head = 'data:video/mp4;base64,'
    video = None
    with open('out.mp4', 'rb') as f:
        video = f.read()
    video = base64.b64encode(video)
    video = head + video.decode('utf-8')

    return jsonify({"video": video, "detections": dets.to_dict()})

@app.route('/')
def index():
    print('index')
    return render_template('index.html')


if __name__ == '__main__':
    print('Starting Server')
    sio.run(app, host=HOST_IP, port=HOST_PORT)
