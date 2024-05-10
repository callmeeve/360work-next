import React, { useEffect, useState } from "react";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import api from "@/components/data/utils/api";

const EmployeeAttendancePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const date = {
    toDateString: (date) => new Date(date).toDateString(),
    toTimeString: (date) =>
      new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  };

  useEffect(() => {
    const getSchedules = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/employee/schedule/all");
        const data = res.data.schedules;
        setSchedules(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getSchedules();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="my-8">
        <div className="text-xl font-semibold">Schedule</div>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        <div className="mt-4">
          {schedules.length === 0 && <div>No schedules found</div>}
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex flex-row my-4">
              <div className="p-4 bg-white shadow-sm rounded-md border max-w-md w-full">
                <div className="flex flex-row justify-between">
                  <div className="font-semibold">
                    {date.toDateString(schedule.startDate)}
                    <div className="flex flex-row">
                      <div>{date.toTimeString(schedule.startTime)}</div>
                      <div className="mx-2">-</div>
                      <div>{date.toTimeString(schedule.endTime)}</div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    {date.toDateString(schedule.endDate)}
                    <div className="flex flex-row">
                      <div>{date.toTimeString(schedule.startTime)}</div>
                      <div className="mx-2">-</div>
                      <div>{date.toTimeString(schedule.endTime)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(EmployeeAttendancePage);
