import React, { useState } from "react";
import WebcamComponent from "@/components/partials/WebcamComp";
import api from "@/components/data/utils/api";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";

const EmployeeAttendancePage = () => {
  const [checkInImage, setCheckInImage] = useState(null);
  const [checkOutImage, setCheckOutImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckInCapture = (imageSrc) => {
    setCheckInImage(imageSrc);
  };

  const handleCheckOutCapture = (imageSrc) => {
    setCheckOutImage(imageSrc);
  };

  const handleSubmitCheckIn = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("image", checkInImage);
  
      const res = await api.post("/api/employee/attendance/checkin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (res.status === 200) {
        alert("Check In submitted successfully");
        setCheckInImage(null);
      }
    } catch (error) {
      setError(error.response.data.message || "Error submitting Check In");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitCheckOut = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("image", checkOutImage);
  
      const res = await api.post("/api/employee/attendance/checkout", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (res.status === 200) {
        alert("Check Out submitted successfully");
        setCheckOutImage(null);
      }
    } catch (error) {
      setError(error.response.data.message || "Error submitting Check Out");
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
        <div className="flex flex-col md:flex-row gap-5">
          <div className="bg-white w-96 rounded border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Check In</h2>
              {checkInImage ? (
                <div>
                  <img src={checkInImage} alt="Check In" className="mb-4" />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    onClick={handleSubmitCheckIn}
                    disabled={loading}
                  >
                    Submit Check In
                  </button>
                </div>
              ) : (
                <WebcamComponent onCapture={handleCheckInCapture} />
              )}
            </div>
          </div>
          <div className="bg-white w-96 rounded border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Check Out</h2>
              {checkOutImage ? (
                <div>
                  <img src={checkOutImage} alt="Check Out" className="mb-4" />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    onClick={handleSubmitCheckOut}
                    disabled={loading}
                  >
                    Submit Check Out
                  </button>
                </div>
              ) : (
                <WebcamComponent onCapture={handleCheckOutCapture} />
              )}
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
