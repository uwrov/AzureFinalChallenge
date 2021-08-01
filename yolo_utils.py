from collections import OrderedDict

import cv2
import numpy as np


# Representation of a single bounding box,
# used to ensure compability with darknet python API
class BBox:
    def __init__(self, name, prob, x, y, w, h):
        self.name = name
        self.prob = prob
        self.x = x
        self.y = y
        self.w = w
        self.h = h
    
    def __str__(self):
        string = f'x: {self.x}, y: {self.y}, w: {self.w}, h: {self.h}, '
        string += f'probability: {self.prob}, name: {self.name}'
        return string

    def to_xyxy(self):
        """
        From bounding box yolo format
        to corner points cv2 rectangle
        """
        xmin = int(round(self.x - (self.w / 2)))
        xmax = int(round(self.x + (self.w / 2)))
        ymin = int(round(self.y - (self.h / 2)))
        ymax = int(round(self.y + (self.h / 2)))
        return xmin, ymin, xmax, ymax
        # return np.array([self.x, self.y, self.x + self.w, self.y + self.h])

# Represents one object being tracked by the centroid tracker
class TrackedObject:
    def __init__(self, timestamp: int, bbox: BBox):
        self.initial_timestamp = timestamp
        self.max_timestamp = timestamp
        self.nframes = 1
        self.curr_bbox = bbox
        self.centroid = self._find_centroid(bbox)

    def update(self, timestamp:int, bbox: BBox) -> None:
        self.centroid = self._find_centroid(bbox)
        self.nframes += 1
        self.curr_bbox = bbox

    def _find_centroid(self, bbox: BBox) -> np.array:
        xmin, ymin, xmax, ymax = bbox.to_xyxy()
        return np.array([np.mean([xmin, xmax]), np.mean([ymin, ymax])])

    def _area(self, bbox: BBox):
        return bbox.w * bbox.h

    def __str__(self):
        return 'intial_timestamp: ' + str(self.initial_timestamp) + '\nmax_timestamp: ' + str(self.max_timestamp) + '\nnframes: ' + str(self.nframes) + \
                + '\ncentroid: ' + str(self.centroid) + '\ncurr_bbox: ' + str(self.curr_bbox)

# Manages centroid tracking algorithm
class CentroidTracker:
    def __init__(self, max_disappeared=15, max_distance=5):
        self.next_id = 0
        self.output_log = OrderedDict()
        self.registered = OrderedDict()
        self.disappeared = OrderedDict()
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def update(self, detected: list, timestamp: int) -> None:
        # Take in a list of detected bounding boxes from our yolo detector
        # update the registered centroids we're keeping track of

        # detected is a list of detections, which are a tuple (name, probability, (x, y, w, h))

        if len(self.registered) == 0:
            # initial case, register all detected objects
            for detection in detected:
                x, y, w, h = detection[2]
                self.registered[self.next_id] = TrackedObject(timestamp, BBox(detection[0], detection[1], x, y, w, h))
                self.next_id += 1
        else:
            # Try to match detected objects to what we have registered
            unmatched = set(self.registered.keys())
            new_objects = []
            for i, detection in enumerate(detected):
                x, y, w, h = detection[2]
                bbox = BBox(detection[0], detection[1], x, y, w, h)
                nn = self._find_neighbor(bbox)
                if nn in unmatched:
                    unmatched.remove(nn)
                    self.disappeared[nn] = 0
                    self.registered[nn].update(timestamp, bbox)
                elif nn == -1:
                    new_objects.append(i)

            # register a new object
            for i in new_objects:
                self.registered[self.next_id] = TrackedObject(timestamp, detected[i])
                self.next_id += 1

            # deregister an old object which has been gone for too long
            for id in unmatched:
                if id not in self.disappeared.keys():
                    self.disappeared[id] = 0
                self.disappeared[id] += 1
                if self.disappeared[id] > self.max_disappeared:
                    self._deregister(id)
        return

    def signal_end(self) -> OrderedDict:
        for id in list(self.registered.keys()):
            self._deregister(id)

        return self.output_log

    def get_registered_objects(self) -> OrderedDict:
        return self.registered

    def _deregister(self, id: int):
        self.output_log[id] = self.registered.pop(id)

    def _find_neighbor(self, bbox: BBox) -> int:
        min_idx = -1
        min_dist = 100000
        c = self._find_centroid(bbox)

        for idx in self.registered.keys():
            obj = self.registered[idx]
            dist = np.linalg.norm(c - obj.centroid)
            if dist < min_dist and dist < self.max_distance:
                min_idx = idx
                min_dist = dist

        return min_idx

    def _find_centroid(self, bbox: BBox) -> np.array:
        xmin, ymin, xmax, ymax = bbox.to_xyxy()
        return np.array([np.mean([xmin, xmax]), np.mean([ymin, ymax])])


# draws bounding box and label text that ✨scales✨ with image size
def draw_bounding_box_and_label(image, xmin, ymin, xmax, ymax, box_color, label):
    image_h = image.shape[0]
    image_w = image.shape[1]

    xmin = int(xmin)
    ymin = int(ymin)
    xmax = int(xmax)
    ymax = int(ymax)

    # bounding box
    cv2.rectangle(image, (xmin, ymin), (xmax, ymax), box_color, thickness=int(0.001 * image_h))

    # background rectangle for text
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.001 * image_h
    font_thickness = 4
    text_size, _ = cv2.getTextSize(label, font, font_scale, font_thickness)
    text_w, text_h = text_size

    # label at top left
    xmin_in_frame = max(xmin, 0)
    ymin_in_frame = max(ymin, 0)
    xmax_in_frame = min(xmax, image_w)
    ymax_in_frame = min(ymax, image_h)
    bottom_left_coord = (xmin_in_frame, ymin_in_frame)
    top_right_coord = (xmin_in_frame + text_w, ymin_in_frame - text_h)
    # if top of label out of frame, move to bottom
    if ymin_in_frame - text_h < 0:
        bottom_left_coord = (bottom_left_coord[0], ymax_in_frame + text_h)
        top_right_coord = (top_right_coord[0], ymax_in_frame)
        # if bottom of label now out of frame, move label to bottom of bounding box
        if ymax_in_frame + text_h > image_h:
            bottom_left_coord = (bottom_left_coord[0], ymax_in_frame)
            top_right_coord = (top_right_coord[0], ymax_in_frame - text_h)
    # if right of label out of frame, move left, unless that would cause left of label to be out of frame
    if xmin_in_frame + text_w > image_w and xmax_in_frame - text_w > 0:
        bottom_left_coord = (xmax_in_frame - text_w, bottom_left_coord[1])
        top_right_coord = (xmax_in_frame, top_right_coord[1])
    cv2.rectangle(image, bottom_left_coord, top_right_coord, box_color, -1)
    cv2.putText(image, label, bottom_left_coord, font, font_scale, (255, 255, 255), font_thickness)

# BGR
box_colors = {
    'b-chub': (0, 0, 255), # red
    'hogfish': (255, 0, 255), # fuscia
    's-major': (0, 200, 0), # green
    's-parrotfish': (255, 0, 0), # blue
    'y-stingray': (255, 0, 128), # purple
}
