const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb.",
  };

  let perPage = 10;
  let page = req.query.page || 1;

  try {
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
    //res.status(500).send("Internal Server Error");
  }
});

router.get("/about", (req, res) => {
  res.render("about", { currentRoute: `/about` });
});

router.get("/contact", (req, res) => {
  res.render("contact", { currentRoute: `/contact` });
});

router.get("/post/:id", async (req, res) => {
  try {
    const locals = {
      title: "Nodejs Blog",
      description: "Simple Blog created with locals, Express & Mongodb",
      currentRoute: `/post/${slug}`,
    };
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "search",
      description: "Simple Blog created with locals, Express & Mongodb",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    // Assuming you want to render a view and pass data to it
    res.render("search", {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
    //res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
