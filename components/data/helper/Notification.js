import React, { useEffect, useState } from "react";
import { Popover } from "@headlessui/react";
import { IoCloseCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import api from "../utils/api";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    try {
      const response = await api.get("/api/employee/notification/all");
      const data = response.data;
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put("/api/employee/notification/update", { id });
      getNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete("/api/employee/notification/delete", { data: { id } });
      getNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="relative ml-auto mr-4">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button className="flex items-center justify-end focus:outline-none">
              <IoNotificationsOutline className="text-2xl text-gray-800" />
            </Popover.Button>
            <Popover.Panel
              className={`${
                open ? "block" : "hidden"
              } absolute right-0 w-80 bg-white p-4 shadow-lg rounded-lg`}
            >
              <h1 className="text-lg font-semibold mb-4">Notifications</h1>
              <div className="mt-2">
                {notifications.length === 0 ? (
                  <p className="text-gray-600">No Notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${
                        notification.read
                          ? "bg-green-100 text-green-500"
                          : "bg-white text-gray-800"
                      } p-4 rounded-lg mb-2 cursor-pointer`}
                      onClick={() => handleUpdate(notification.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <h1 className="text-sm font-semibold">
                            {notification.title}
                          </h1>
                          <p className="text-xs">{notification.message}</p>
                        </div>
                        <IoCloseCircleOutline
                          onClick={() => handleDelete(notification.id)}
                          className="text-2xl ml-auto text-red-500"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
}
