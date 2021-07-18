#!/usr/bin/env python3
import json
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

HOST_IP = "localhost"
HOST_PORT = "4040"

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins="*")

def send_video():
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
