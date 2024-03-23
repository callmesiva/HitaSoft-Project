const PostData = require("../../models/postDataModel");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.getData = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );

    const postIds = data.map((post) => post.id);
    const existingPosts = (await PostData.find({ id: { $in: postIds } })).map(
      (post) => post.id
    );
    const newPosts = data.filter((post) => !existingPosts.includes(post.id));
    if (newPosts.length > 0) await PostData.insertMany(newPosts);

    const postsWithoutDeleted = await PostData.find({ isDeleted: false }).limit(
      10
    );
    const totalData = await PostData.countDocuments({ isDeleted: false });

    const imageData = postsWithoutDeleted.map((post) => {
      const imagePath = path.join(
        __dirname,
        "../images",
        `image_${post.id}.png`
      );
      let imageBase64 = "";
      if (fs.existsSync(imagePath)) {
        imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
      }
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        image: imageBase64 ? `data:image/png;base64,${imageBase64}` : "",
      };
    });

    res.status(200).json({ totalData: imageData, totalCount: totalData });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPage = async (req, res) => {
  const { page, limit } = req.query;
  const skip = parseInt(page) * parseInt(limit);

  try {
    let response = await PostData.find({ isDeleted: false })
      .skip(skip)
      .limit(parseInt(limit));

    const imageData = response.map((post) => {
      const imagePath = path.join(
        __dirname,
        "../images",
        `image_${post.id}.png`
      );
      let imageBase64 = "";
      if (fs.existsSync(imagePath)) {
        imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
      }
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        image: imageBase64 ? `data:image/png;base64,${imageBase64}` : "",
      };
    });
    res.status(200).json(imageData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateData = async (req, res) => {
  const { id, title, body, image } = req.body;
  try {
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const imageName = `image_${id}.png`;
    const imagePath = path.join(__dirname, "../images", imageName);
    fs.writeFileSync(imagePath, buffer);

    const updatedPost = await PostData.findOneAndUpdate(
      { id },
      { title, body, image: `/images/${imageName}` },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to delete a post
exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    await PostData.findOneAndUpdate({ id: postId }, { isDeleted: true });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
