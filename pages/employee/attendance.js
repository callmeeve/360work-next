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

  const handleSubmit = async (imageSrc, setImage, url, setCompleted, title) => {
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
      alert(`${title} successful`);
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
          {!checkInCompleted ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold">Check In</h2>
              <Webcam
                ref={webcamRefCheckIn}
                audio={false}
                screenshotFormat="image/jpeg"
                width="100%"
                height="100%"
                onUserMedia={() => alert("Webcam is ready")}
              />
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleCapture(webcamRefCheckIn, setCheckInImage)}
              >
                Capture
              </button>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() =>
                  handleSubmit(
                    checkInImage,
                    setCheckInImage,
                    "/api/employee/attendance/checkin",
                    setCheckInCompleted,
                    "Check In"
                  )
                }
              >
                Check In
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold">Check Out</h2>
              <Webcam
                ref={webcamRefCheckOut}
                audio={false}
                screenshotFormat="image/jpeg"
                width="100%"
                height="100%"
                onUserMedia={() => alert("Webcam is ready")}
              />
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleCapture(webcamRefCheckOut, setCheckOutImage)}
              >
                Capture
              </button>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() =>
                  handleSubmit(
                    checkOutImage,
                    setCheckOutImage,
                    "/api/employee/attendance/checkout",
                    null,
                    "Check Out"
                  )
                }
              >
                Check Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);