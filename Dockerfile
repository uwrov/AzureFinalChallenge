# syntax=docker/dockerfile:1
FROM python:3.6
COPY . /src
WORKDIR /src

# env setup
ENV DATA_URL="https://app.roboflow.com/ds/08KgRqa2AE?key=xpHsDDSSN9"
ENV WORKSPACE=/src
ENV DARKNET_DIR=/src/darknet
ENV LIB_DARKNET=${DARKNET_DIR}/libdarknet.so
ENV PYTHONPATH=${PYTHONPATH}:${DARKNET_DIR}
ENV YOLO_WEIGHTS=${WORKSPACE}/files/yolo_weights.weights
ENV YOLO_DATA=${DARKNET_DIR}/data/obj.data
ENV YOLO_CONFIG=${WORKSPACE}/files/yolo_config.cfg

# install python dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    libopencv-dev \
    libomp-dev
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# build darknet
RUN git clone https://github.com/AlexeyAB/darknet.git
RUN sed -i 's/OPENCV=0/OPENCV=1/g' darknet/Makefile
RUN sed -i 's/LIBSO=0/LIBSO=1/g' darknet/Makefile
RUN sed -i 's/OPENMP=0/OPENMP=1/g' darknet/Makefile
RUN cd darknet && make

RUN bash gather_data.bash
