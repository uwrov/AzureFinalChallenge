import glob
import os
import random

import cv2
import darknet
import numpy as np


def load_images(images_path):
    """
    If image path is given, return it directly
    For txt file, read it and return each line as image path
    In other case, it's a folder, return a list with names of each
    jpg, jpeg and png file
    """
    input_path_extension = images_path.split('.')[-1]
    if input_path_extension in ['jpg', 'jpeg', 'png', 'PNG']:
        return [images_path]
    elif input_path_extension == "txt":
        with open(images_path, "r") as f:
            return f.read().splitlines()
    else:
        return glob.glob(
            os.path.join(images_path, "*.jpg")) + \
            glob.glob(os.path.join(images_path, "*.png")) + \
            glob.glob(os.path.join(images_path, "*.jpeg"))


def image_detection(image_path, network, class_names, class_colors, thresh):
    # Darknet doesn't accept numpy images.
    # Create one with image we reuse for each detect
    width = darknet.network_width(network)
    height = darknet.network_height(network)
    darknet_image = darknet.make_image(width, height, 3)

    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (width, height),
                               interpolation=cv2.INTER_LINEAR)

    darknet.copy_image_from_bytes(darknet_image, image_resized.tobytes())
    detections = darknet.detect_image(network, class_names, darknet_image, thresh=thresh)
    darknet.free_image(darknet_image)
    # stretch bounding boxes to original image size
    detections_original_size = detections_to_original_size(detections, image.shape[1], image.shape[0], width, height)
    image = darknet.draw_boxes(detections_original_size, image_rgb, class_colors)
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB), detections_original_size


def detections_to_original_size(detections, image_w, image_h, network_w, network_h):
    detections_original_size = []
    for i, detection in enumerate(detections):
        x, y, w, h = detection[2]
        detections_original_size.append((detection[0], detection[1], (x * image_w / network_w, y * image_h / network_h, w * image_w / network_w, h * image_h / network_h)))
    return detections_original_size


def image_classification(image, network, class_names):
    width = darknet.network_width(network)
    height = darknet.network_height(network)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (width, height),
                                interpolation=cv2.INTER_LINEAR)
    darknet_image = darknet.make_image(width, height, 3)
    darknet.copy_image_from_bytes(darknet_image, image_resized.tobytes())
    detections = darknet.predict_image(network, darknet_image)
    predictions = [(name, detections[idx]) for idx, name in enumerate(class_names)]
    darknet.free_image(darknet_image)
    return sorted(predictions, key=lambda x: -x[1])


def convert2relative(image, bbox):
    """
    YOLO format use relative coordinates for annotation
    """
    x, y, w, h = bbox
    height, width, _ = image.shape
    return x/width, y/height, w/width, h/height


# rgb image
def get_detections(image, network, class_names, thresh):
    # Darknet doesn't accept numpy images.
    # Create one with image we reuse for each detect
    width = darknet.network_width(network)
    height = darknet.network_height(network)
    darknet_image = darknet.make_image(width, height, 3)

    image_rgb = image #cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (width, height),
                               interpolation=cv2.INTER_LINEAR)

    darknet.copy_image_from_bytes(darknet_image, image_resized.tobytes())
    detections = darknet.detect_image(network, class_names, darknet_image, thresh=thresh)
    darknet.free_image(darknet_image)
    # stretch bounding boxes to original image size
    return detections_to_original_size(detections, image.shape[1], image.shape[0], width, height)


def main(input, thresh=.25):
    random.seed(3)  # deterministic bbox colors
    
    weights=os.environ['YOLO_WEIGHTS']
    data_file=os.environ['YOLO_DATA']
    config_file=os.environ['YOLO_CONFIG']
    network, class_names, class_colors = darknet.load_network(
        config_file,
        data_file,
        weights,
        batch_size = 1
    )

    images = load_images(input)
    image_name = images[0]
    image, detections = image_detection(image_name, network, class_names, class_colors, thresh)
    # darknet.print_detections(detections)    
    cv2.imshow('sample', image)
    while not cv2.waitKey() & 0xFF == ord('q'):
        continue

if __name__ == '__main__':
    import sys
    main(sys.argv[1])
