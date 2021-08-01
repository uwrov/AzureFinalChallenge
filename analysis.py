import cv2
import darknet
import numpy as np

from yolo_image import *
from yolo_utils import *

def detect_video(input_path, output_path, selected_fish):
    cap = cv2.VideoCapture(input_path)

    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(output_path, fourcc, 30.0, (int(cap.get(3)), int(cap.get(4))))
    ct = CentroidTracker(max_distance=50)
    results = None

    weights=os.environ['YOLO_WEIGHTS']
    data_file=os.environ['YOLO_DATA']
    config_file=os.environ['YOLO_CONFIG']
    network, class_names, class_colors = darknet.load_network(
        config_file,
        data_file,
        weights,
        batch_size = 1
    )

    thresh = 0.5
    results = None

    while(cap.isOpened()):
        ret, frame = cap.read()
        if not ret:
            results = ct.signal_end()
            break
        
        dets = get_detections(frame, network, class_names, thresh)
        filtered = []
        for det in dets:
            if det[0] not in selected_fish:
                continue
            filtered.append(dets)
            x, y, w, h = det[2]
            bbox = BBox(det[0], det[1], x, y, w, h)
            xmin, ymin, xmax, ymax = bbox.to_xyxy()
            draw_bounding_box_and_label(frame, xmin, ymin, xmax, ymax, box_colors[bbox.name], label=bbox.name)

        ct.update(filtered, cap.get(cv2.CAP_PROP_POS_FRAMES))

        out.write(frame)

    cap.release()

    return results

def filter_results(data, min_frames=5):
    final_results = {} # id -> (name, timestamp)

    for id in data.keys():
        obj = data[id]
        if (obj.nframes >= min_frames):
            first_timestamp = np.around(obj.initial_timestamp / 30)
            tm = str(int(first_timestamp // 60))
            ts = first_timestamp % 60
            ts = '0' + str(int(ts)) if ts < 10 else str(int(ts))
            timestamp = tm + ":" + ts
            name = obj.curr_bbox.name
            final_results[id] = (name, timestamp)
    
    return final_results