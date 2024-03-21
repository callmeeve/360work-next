import React, { useEffect, useState } from "react";
import api from "@/components/data/utils/api";
import RoleBasedLayout from "@/components/data/helper/RoleBasedLayout";
import { HiOutlineTrash, HiPencilSquare } from "react-icons/hi2";
import { IoFilter } from "react-icons/io5";

const ManagerCompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/company/all");
      const data = res.data.companies;
      setCompanies(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/manager/company/create", {
        name,
        address,
        email,
      });
      const data = res.data;
      setCompanies([...companies, data]);
      setName("");
      setAddress("");
      setEmail("");

      alert("Company created successfully");

      window.location.reload();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <div>
            {companies.length === 0 ? (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-full mb-5">
                  <label htmlFor="name" className="text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex flex-col w-full mb-5">
                  <label
                    htmlFor="address"
                    className="text-sm font-semibold mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex flex-col w-full mb-5">
                  <label htmlFor="email" className="text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  {loading ? "Loading..." : "Create"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-2">
                  <h1 className="text-2xl font-semibold">Companies</h1>
                  <button
                    type="button"
                    className="inline-flex px-3 py-2 items-center gap-x-2 text-sm font-medium rounded border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <IoFilter className="w-5 h-5" />
                    Filter Table
                  </button>
                </div>
                <div className="-m-2 overflow-x-auto">
                  <div className="p-4 min-w-full inline-block align-middle">
                    <div className="border overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                            >
                              Address
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {companies.map((company, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                {company.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {company.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                {company.address}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  type="button"
                                  className="mr-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <HiPencilSquare className="w-5 h-5" />
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-500 hover:text-red-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <HiOutlineTrash className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout(ManagerCompanyPage);
