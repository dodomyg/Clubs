import React, { useContext, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import UserContext from "./context/UserContext";
import SideBar from "./Chat/SideBar";
import MyChat from "./Chat/MyChat";
import ChatBox from "./Chat/ChatBox";
import ErrorPage from "./ErrorPage";
axios.defaults.withCredentials = true;

const Chat = () => {
  const { user } = useContext(UserContext);
  const [fetchChat, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}
      <Box
        display={"flex"}
        width={"100%"}
        h={"90vh"}
        p={5}
        justifyContent={"space-between"}
      >
        {user && <MyChat fetchChat={fetchChat} />}
        {user && (
          <ChatBox fetchChat={fetchChat} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
