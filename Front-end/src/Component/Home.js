import React, { useEffect, useState } from "react";
import axios from "axios";
import Popup from "./Popup";
import url from "../utils/constUrl";

function Home() {
  const [showPop, setShowPop] = useState("");
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loader, setLoader] = useState(false);
  const [bBorder, setBborder] = useState(0);

  //Handling Open and Close popup
  const handleAddMemberClick = (details) => setShowPop(details);
  const handleClosePopup = () => setShowPop("");

  //Fetch posts
  let fetchData = async () => {
    try {
      setData([]);
      setBborder(0);
      setLoader(true);
      const response = await axios.get(`${url}/postlist`);
      localStorage.setItem("fetchData", true);
      setLoader(false);
      setData(response?.data?.totalData);
      setTotalData(response?.data?.totalCount);
    } catch (error) {
      console.error("Error fetching posts data:", error);
    }
  };

  //Fetch page
  async function pagination(crrPage) {
    try {
      let pageData = await axios.get(`${url}/getpage?page=
      ${crrPage}&limit=${10}`);
      setData(pageData?.data);
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
  }

  // useEffect(() => {
  //   if (localStorage.getItem("fetchData")) fetchData();
  // }, []);

  //Delete post
  const deleteEmp = async (details) => {
    try {
      await axios.delete(`${url}/postlist/${details.id}`);
      let arr = data.filter((post) => post.id != details.id);
      setData(arr);
    } catch (error) {
      console.error("Error deleting employee details:", error);
      alert("Failed to delete employee details");
    }
  };

  return (
    <div className="lg:w-[1000px] mx-auto">
      <div className="items-center p-5">
        <h4 className="text-center text-xl font-semibold">Post List</h4>
      </div>
      <div className="bg-lime-600 h-16 w-full flex flex-col justify-center">
        <div className="flex justify-end">
          <button
            className="text-white mx-4 w-40 h-10 p-2 rounded-sm bg-blue-950"
            onClick={fetchData}
          >
            <h4>Sync Data</h4>
          </button>
        </div>
      </div>

      {showPop && (
        <Popup
          onClose={handleClosePopup}
          details={showPop}
          setData={setData}
          data={data}
        />
      )}

      <table className="w-full">
        <thead>
          <tr>
            <th className="w-64 border-2 text-center">Id</th>
            <th className="w-64 h-10 border-2 text-center">Title</th>
            <th className="w-64 border-2 text-center">Body</th>
            <th className="w-64 border-2 text-center">Image</th>
            <th className="w-64 border-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loader ? (
            <tr>
              <td colSpan="6" className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                  className="inline-block mt-20 align-middle"
                >
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              </td>
            </tr>
          ) : (
            data.map((details) => {
              const titl = details?.title ? details.title.substring(0, 80) : "";
              const body = details?.body ? details.body.substring(0, 80) : "";
              return (
                <tr className="border-2" key={details.id}>
                  <td className="w-52 border-x-2 text-center">{details?.id}</td>
                  <td className="w-52 h-10 border-x-2 text-center">{titl}</td>
                  <td className="w-52 border-x-2 text-center">{body}</td>
                  <td className="w-52 border-x-2 text-center ">
                    <img src={details?.image} alt=""></img>
                  </td>
                  <td className="w-52 border-x-2 text-center">
                    <div className=" flex  justify-around mx-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-6 h-6"
                        onClick={() => handleAddMemberClick(details)}
                      >
                        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-6 h-6"
                        onClick={() => deleteEmp(details)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {data.length != 0 ? (
        <div className="flex justify-center mt-5 space-x-2">
          {bBorder == 0 ? (
            <></>
          ) : (
            <button
              className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-400 "
              onClick={() => {
                setBborder(bBorder - 1);
                pagination(bBorder - 1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {Array.from({ length: Math.ceil(totalData / 10) }).map((_, index) => (
            <button
              key={index}
              className={`p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-400 ${
                index == bBorder ? "bg-gray-400" : ""
              }`}
              onClick={() => {
                setBborder(index);
                pagination(index);
              }}
            >
              {index + 1}
            </button>
          ))}

          {bBorder == Math.ceil(totalData / 10) - 1 ? (
            <></>
          ) : (
            <button
              className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-400"
              onClick={() => {
                setBborder(bBorder + 1);
                pagination(bBorder + 1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Home;
