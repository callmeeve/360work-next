import React, { useState, useRef, useEffect, Fragment } from "react";
import api from "@/components/data/utils/api";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { HiOutlineCamera } from "react-icons/hi2";
import { Dialog, Transition } from "@headlessui/react";
import { CheckInComp } from "@/components/partials/employee/CheckInComp";
import { CheckOutComp } from "@/components/partials/employee/CheckOutComp";

const EmployeeAttendancePage = () => {
  const [employee, setEmployee] = useState();
  const [checkInImage, setCheckInImage] = useState(null);
  const [checkOutImage, setCheckOutImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [checkInCompleted, setCheckInCompleted] = useState(false);

  const today = new Date();

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  function openCheckIn() {
    setCheckInOpen(true);
    setCheckOutOpen(false);
  }

  function closeModal() {
    setCheckInOpen(false);
    setCheckOutOpen(false);
  }

  function openCheckOut() {
    setCheckInOpen(false);
    setCheckOutOpen(true);
  }

  const webcamRefCheckIn = useRef(null);
  const webcamRefCheckOut = useRef(null);

  const handleCapture = (webcamRef, setImage) => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  };

  const getEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/employee/all");
      const data = res.data.employee;
      setEmployee(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

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

  let workStart;
  let workEnd;

  if (employee) {
    workStart = new Date(employee.workStart);
    workEnd = new Date(employee.workEnd);
  }

  loading && <p>Loading...</p>;

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="my-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Employee Attendance</h1>
          <p className="text-gray-500">Upload your attendance here</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
          {!checkInCompleted ? (
            <div
              className="p-4 bg-white border shadow-sm rounded cursor-pointer"
              onClick={openCheckIn}
            >
              <div className="flex flex-col gap-y-4 lg:flex-row items-center justify-center">
                <div className="size-16 flex items-center justify-center bg-blue-100 rounded-md">
                  <h1 className="text-xl font-medium text-blue-500">
                    {today.toLocaleString(undefined, { weekday: "short" })}
                  </h1>
                </div>
                <div className="flex flex-col text-center lg:text-start ml-0 lg:ml-4">
                  <h2 className="text-lg font-semibold">
                    {today.toLocaleString("id-ID", { dateStyle: "long" })}
                  </h2>
                  <p className="text-gray-500">
                    {workStart?.toLocaleString(undefined, {
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="size-16 flex items-center justify-center bg-blue-100 rounded-md ml-0 lg:ml-auto">
                  <HiOutlineCamera className="text-2xl text-blue-500" />
                </div>
              </div>
              <Transition appear show={checkInOpen} as={Fragment}>
                <Dialog
                  as="div"
                  open={checkInOpen}
                  className="relative z-10"
                  onClose={closeModal}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black/25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-lg text-center font-medium leading-6 text-gray-900"
                          >
                            Check In
                          </Dialog.Title>
                          <CheckInComp
                            webcamRefCheckIn={webcamRefCheckIn}
                            capture={() =>
                              handleCapture(webcamRefCheckIn, setCheckInImage)
                            }
                            checkIn={() =>
                              handleSubmit(
                                checkInImage,
                                setCheckInImage,
                                "/api/employee/attendance/checkin",
                                setCheckInCompleted(true),
                                "Check In"
                              )
                            }
                          />
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          ) : (
            <div
              className="p-4 bg-white border shadow-sm rounded cursor-pointer"
              onClick={openCheckOut}
            >
              <div className="flex items-center">
                <div className="size-16 flex items-center justify-center bg-blue-100 rounded-md">
                  <h1 className="text-xl font-medium text-blue-500">
                    {today.toLocaleString(undefined, { weekday: "short" })}
                  </h1>
                </div>
                <div className="flex flex-col ml-4">
                  <h2 className="text-lg font-semibold">
                    {today.toLocaleString("id-ID", { dateStyle: "long" })}
                  </h2>
                  <p className="text-gray-500">
                    {workEnd?.toLocaleString(undefined, {
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="size-16 flex items-center justify-center bg-blue-100 rounded-md ml-auto">
                  <HiOutlineCamera className="text-2xl text-blue-500" />
                </div>
              </div>
              <Transition appear show={checkOutOpen} as={Fragment}>
                <Dialog
                  as="div"
                  open={checkOutOpen}
                  className="relative z-10"
                  onClose={closeModal}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black/25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-lg text-center font-medium leading-6 text-gray-900"
                          >
                            Check Out
                          </Dialog.Title>
                          <CheckOutComp
                            webcamRefCheckOut={webcamRefCheckOut}
                            capture={() =>
                              handleCapture(webcamRefCheckOut, setCheckOutImage)
                            }
                            checkOut={() =>
                              handleSubmit(
                                checkOutImage,
                                setCheckOutImage,
                                "/api/employee/attendance/checkout",
                                setCheckInCompleted(true),
                                "Check Out"
                              )
                            }
                          />
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
