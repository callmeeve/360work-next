import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamComponent = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, setCapturedImage, onCapture]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        height="100%"
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={capture}
      >
        Capture
      </button>
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          className="mt-4 w-1/2 h-auto"
        />
      )}
    </div>
  );
};

export default WebcamComponent;
