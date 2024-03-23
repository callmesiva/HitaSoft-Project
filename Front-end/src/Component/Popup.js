import React, { useState } from "react";
import axios from "axios";
import url from "../utils/constUrl";

function Popup({ onClose, details, setData, data }) {
  const [id, setId] = useState(details.id || "");
  const [title, setTitle] = useState(details?.title || "");
  const [body, setBody] = useState(details?.body || "");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData = { id, title, body, image };
      let response = await axios.post(`${url}/postlist`, updatedData);
      let index = data.findIndex((post) => post.id == id);
      data[index] = updatedData;
      onClose();
    } catch (error) {
      console.error("Error update posts data:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white py-5 m-2 w-[320px] rounded-md"
      >
        <h4 className="text-xl text-center font-semibold mb-4 p-3 bg-lime-600">
          Edit Post
        </h4>

        <div className="flex flex-col w-64 mx-auto shadow-md">
          <label className="ml-1">Title :</label>
          <textarea
            id="title"
            className="p-1 h-10 rounded py-2 px-3 text-gray-700 focus:outline-none"
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col mt-2 w-64  mx-auto shadow-md">
          <label className="ml-1 mb-1">Body :</label>
          <textarea
            id="body"
            className="p-1 h-20 py-2 px-3 text-gray-700 focus:outline-none"
            placeholder="Body"
            value={body}
            required
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="flex flex-col mt-3 mb-5 w-64  mx-auto shadow-md">
          <label htmlFor="image" className="ml-1 mb-1">
            Image :
          </label>
          <input
            id="image"
            className="p-1 h-10 py-2 px-3 text-gray-700 focus:outline-none"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex justify-around mt-3">
          <button
            onClick={onClose}
            className="bg-red-500 text-white w-16 h-7 rounded-sm"
            type="button"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white w-16 h-7 rounded-sm"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Popup;
