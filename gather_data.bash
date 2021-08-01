#!/bin/bash

cd $DARKNET_DIR

curl -L $DATA_URL > roboflow.zip; unzip roboflow.zip; rm roboflow.zip

mkdir data/obj

cp train/*.jpg data/obj/
cp train/*.txt data/obj/

cp valid/*.jpg data/obj/
cp valid/*.txt data/obj/

cp $WORKSPACE/files/train.txt $DARKNET_DIR/data/obj
cp $WORKSPACE/files/valid.txt $DARKNET_DIR/data/obj

cp $WORKSPACE/files/obj.names $DARKNET_DIR/data/obj.names
printf "classes=5\ntrain=$DARKNET_DIR/data/train.txt\nvalid=$DARKNET_DIR/data/valid.txt\nnames=$DARKNET_DIR/data/obj.names\nbackup=$DARKNET_DIR/backup\n" > $DARKNET_DIR/data/obj.data