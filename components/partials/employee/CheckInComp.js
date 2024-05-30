import Webcam from "react-webcam";

export function CheckInComp({ webcamRefCheckIn, capture, checkIn }) {
  return (
    <div>
      <div className="mt-3">
        <Webcam
          ref={webcamRefCheckIn}
          audio={false}
          screenshotFormat="image/jpeg"
          width="100%"
          height="100%"
        />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={capture}
        >
          Capture
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={checkIn}
        >
          Check In
        </button>
      </div>
    </div>
  );
}
