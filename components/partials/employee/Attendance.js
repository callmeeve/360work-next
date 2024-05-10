import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import api from "@/components/data/utils/api";

const Attendance = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);

    // Convert the base64 image to a Blob
    const response = await fetch(image);
    const blob = await response.blob();

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", blob);

    // Send a POST request to the backend
    try {
      const res = await api.post("/checkIn", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response...
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError(null);
    // Handle check out...
  };

  return (
    <div className="flex flex-col">
      <div className="my-8">
        <h1 className="text-2xl font-bold">Attendance</h1>

        <div className="flex justify-center mt-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />

          <div className="flex flex-col items-center ml-4">
            <button
              onClick={capture}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Capture
            </button>

            {image && (
              <div className="mt-4">
                <Image src={image} width={160} height={120} />
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={handleCheckIn}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Check In
              </button>

              <button
                onClick={handleCheckOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md ml-4"
              >
                Check Out
              </button>

              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
