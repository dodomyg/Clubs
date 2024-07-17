const cookieParser = require("cookie-parser");
const express = require("express");
const verifyToken = require("../Middleware/authToken");
const CHAT = require("../Schema/CHAT");
const USER = require("../Schema/USER");
const router = express.Router();

router.use(cookieParser());

//access chat
router.post("/accessChat", verifyToken, async (req, resp) => {
  const myId = req.userId;
  const { userId } = req.body;
  try {
    if (!userId) {
      return resp.status(400);
    }
    var existChat = await CHAT.find({
      grpChat: false,
      $and: [
        { users: { $elemMatch: { $eq: myId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    existChat = await USER.populate(existChat, {
      path: "latestMessage.sender",
      select: "fullName email image",
    });

    if (existChat.length > 0) {
      resp.send(existChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        grpChat: false,
        users: [myId, userId],
      };

      const createdChat = await CHAT.create(chatData);
      const fullCHat = await CHAT.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      resp.status(201).json(fullCHat);
    }
  } catch (error) {
    resp.status(404).json({ message: error.message });
  }
});

//fetchALlChats of users
router.get("/getChats", verifyToken, async (req, resp) => {
  const userId = req.userId;
  try {
    const getCHats = await CHAT.find({
      users: { $elemMatch: { $eq: userId } },
    }).populate("users", "-password");
    resp.status(200).json(getCHats);
  } catch (error) {
    resp.status(404).json({ message: error.message });
  }
});

//create grp chat
router.post("/createGrpChat", verifyToken, async (req, resp) => {
  const userId = req.userId;
  const { grpName, allUsers } = req.body;
  try {
    if (!grpName || !allUsers) {
      return resp.status(404).json({ error: "Fill all credentials" });
    }
    var users = allUsers;

    if (users.length < 2) {
      return resp
        .status(404)
        .json({ error: "More than 2 users needed to make a grp chat" });
    }
    users.push(userId);
    const newGrp = await CHAT.create({
      chatName: grpName,
      grpChat: true,
      users: users,
      admin: userId,
    });
    const fullGrpCHat = await CHAT.findOne({ _id: newGrp._id })
      .populate("users", "-password")
      .populate("admin", "-password");
    resp.status(200).json(fullGrpCHat);
  } catch (error) {
    resp.status(404).json({ message: error.message });
  }
});

//rename grp
router.put("/rename", verifyToken, async (req, resp) => {
  const userId = req.userId;
  const { chatId, chatName } = req.body;
  try {
    const grptoUpdate = await CHAT.findById(chatId);

    if (grptoUpdate.admin.toString() !== userId) {
      return resp
        .status(403)
        .json({ error: "Only admin can rename the group" });
    }

    const upDatedGrp = await CHAT.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true, runValidators: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");

    resp.status(200).json(upDatedGrp);
  } catch (error) {
    resp.status(404).json({ message: error.message });
  }
});

//add a user to grp
router.put("/addToGrp", verifyToken, async (req, resp) => {
  const userId = req.userId;
  const { chatId, newUserId } = req.body; 
  try {
    const grptoUpdate = await CHAT.findById(chatId);

    if (grptoUpdate.admin.toString() !== userId) {
      return resp
        .status(403)
        .json({ error: "Only admin can add users to the group" });
    }

    const addedGrp = await CHAT.findByIdAndUpdate(
      chatId,
      { $push: { users: newUserId } },
      { new: true, runValidators: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");

    resp.status(200).json(addedGrp);
  } catch (error) {
    resp.status(404).json({ message: error.message });
  }
});

//delete a user from grp
router.put("/deleteFromGrp", verifyToken, async (req, resp) => {
  const userId = req.userId;
  const { chatId, removeUserId } = req.body;
  try {
    const grptoUpdate = await CHAT.findById(chatId);

    if (grptoUpdate.admin.toString() !== userId) {
      return resp
        .status(403)
        .json({ error: "Only admin can remove users from the group" });
    }

    const removeFromGrp = await CHAT.findByIdAndUpdate(
      chatId,
      { $pull: { users: removeUserId } },
      { new: true, runValidators: true }
    )
      .populate("users", "-password")
      .populate("admin", "-password");

    resp.status(200).json(removeFromGrp);
  } catch (error) {
    resp.status(404).json({ error: error.message });
  }
});

module.exports = router;
