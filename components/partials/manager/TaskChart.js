import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import api from "@/components/data/utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TaskChart() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const getTasks = async () => {
    try {
      const response = await api.get("/api/manager/task/all");
      const data = response.data.tasks;
      const statusCounts = data.reduce((acc, task) => {
        acc[task.status] = acc[task.status] + 1 || 1;
        return acc;
      }, {});

      setTasks({
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: "Tasks",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      setError(error);
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-sm p-4 bg-white rounded-md border shadow-sm">
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="w-full h-96">
        <Pie data={tasks} options={options} />
      </div>
    </div>
  );
}
