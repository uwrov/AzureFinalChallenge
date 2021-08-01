# syntax=docker/dockerfile:1
FROM nvidia/cuda:11.4.0-runtime-ubuntu18.04
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
    libopencv-highgui-dev \
    python3 python3-pip \
    git
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# build darknet
RUN git clone https://github.com/AlexeyAB/darknet.git
RUN sed -i 's/OPENCV=0/OPENCV=1/g' darknet/Makefile
RUN sed -i 's/GPU=0/GPU=1/g' darknet/Makefile
RUN sed -i 's/CUDNN=0/CUDNN=1/g' darknet/Makefile
RUN sed -i 's/LIBSO=0/LIBSO=1/g' darknet/Makefile
RUN sed -i "s/ARCH= -gencode arch=compute_60,code=sm_60/ARCH= ${ARCH_VALUE}/g" darknet/Makefile
RUN cd darknet && make

RUN bash gather_data.bash
