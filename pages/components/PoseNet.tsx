
import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgpu';
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

tf.setBackend("webgpu");

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export const PoseNet = () => {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runPoseNet = async () => {
      const net = await posenet.load();
      console.log("PoseNet model loaded");

      setInterval(() => {
        detect(net);
      }, 10);
    };

    runPoseNet();
  }, []);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video dimensions
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make pose estimation
      const pose = await net.estimateSinglePose(video);

      // Draw pose on canvas
      const ctx = canvasRef.current.getContext("2d");
      drawPose(pose, ctx);
    }
  };

  const drawPose = (pose, ctx) => {
    // Draw keypoints
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score >= 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    // Draw skeleton
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score >= 0.5) {
        pose.keypoints.forEach((otherKeypoint) => {
          if (otherKeypoint.score >= 0.5) {
            ctx.beginPath();
            ctx.moveTo(keypoint.position.x, keypoint.position.y);
            ctx.lineTo(otherKeypoint.position.x, otherKeypoint.position.y);
            ctx.strokeStyle = "green";
            ctx.stroke();
          }
        });
      }
    });
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 1280,
          height: 720
        }}
        videoConstraints={videoConstraints}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 1280,
          height: 720
        }}
      />
    </div>
  );
};
