import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import api from "@/components/data/utils/api";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";

const EmployeeAttendancePage = () => {
  const [checkInImage, setCheckInImage] = useState(null);
  const [checkOutImage, setCheckOutImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkInCompleted, setCheckInCompleted] = useState(false);

  const webcamRefCheckIn = useRef(null);
  const webcamRefCheckOut = useRef(null);

  const handleCapture = (webcamRef, setImage) => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  };

  const handleSubmit = async (imageSrc, setImage, url, setCompleted) => {
    setLoading(true);
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      const res = await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      setImage(null);
      setError(null);
      if (setCompleted) {
        setCompleted(true);
      }
    } catch (error) {
      console.error(error);
      setError("Error submitting attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="my-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Employee Attendance</h1>
          <p className="text-gray-500">Upload your attendance here</p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            {
              title: "Check In",
              image: checkInImage,
              setImage: setCheckInImage,
              webcamRef: webcamRefCheckIn,
              url: "/api/employee/attendance/checkin",
              setCompleted: setCheckInCompleted,
            },
            checkInCompleted && {
              title: "Check Out",
              image: checkOutImage,
              setImage: setCheckOutImage,
              webcamRef: webcamRefCheckOut,
              url: "/api/employee/attendance/checkout",
            },
          ]
            .filter(Boolean)
            .map(({ title, image, setImage, webcamRef, url, setCompleted }) => (
              <div key={title} className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">{title}</h2>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  height="100%"
                  onUserMedia={() => alert("Webcam is ready")}
                />
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handleCapture(webcamRef, setImage)}
                >
                  Capture
                </button>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handleSubmit(image, setImage, url, setCompleted)}
                >
                  {title}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);