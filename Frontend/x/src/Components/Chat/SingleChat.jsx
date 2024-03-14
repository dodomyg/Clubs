import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { Box,Tooltip,FormControl,Button,Text,Heading,Menu,Avatar,VStack,Spinner ,MenuList,MenuButton,MenuItem,HStack,Input,Stack,Card,CardBody} from '@chakra-ui/react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSender, getSenderFull } from '../Profile/ChatLogic';
import { useToast } from '@chakra-ui/react'

import UserPopUp from './UserPopUp';
import GroupChatModal from './GroupChatModal';
import axios from "axios"
import io from "socket.io-client"
import GetAllMessages from './GetAllMessages';
axios.defaults.withCredentials=true

const ENDPOINT = "http://localhost:8080";
var socket,selectedChatCompare;


const SingleChat = ({fetchChat,setFetchAgain}) => {

  const {user,notification,SetNotification, setUser,selectedChat,setSelectedChat,chat, setChat} = useContext(UserContext)
  const [loading, setloading] = useState(false);
  const [messages,SetMessages]=useState([])
  const [newMsg,setNewMsg]=useState()
  const [socketCOnnected,setSocketConnected]=useState(false)
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
 
  const toast = useToast()

 

  const fetchAllMessages=async()=>{
    if(!selectedChat){
      return;
    }
    try {
      setloading(true)
      const fetchMesges = await axios.get(`http://localhost:8080/message/${selectedChat._id}`,{withCredentials:true})
      SetMessages(fetchMesges.data)
      console.log(fetchMesges.data);
      setloading(false)
      socket.emit("joinChat",selectedChat._id)
    } catch (error) {
      toast({
        title: "Error occured while fetching messages",
        status: 'error',
        isClosable: true,
      })
      console.log(error);
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  }, []);

  const handleTyping=(e)=>{
    setNewMsg(e.target.value)

    if(!socketCOnnected){
      return;
    }
    if(!typing){
      setTyping(true)
      socket.emit('typing',selectedChat._id)
    }
    let lastTimeTyped  = new Date().getTime()
    var timeLength = 3000
    setTimeout(()=>{
        var nowTime = new Date().getTime()
        var timeDiffernce = nowTime-lastTimeTyped


        if(timeDiffernce >= timeLength && typing){
          socket.emit('stop typing',selectedChat._id)
          setTyping(false)
        }
    },timeLength)
  }

  
  const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMsg){
      socket.emit("stop typing",selectedChat._id)
      try {
        setNewMsg("");
        const resp = await axios.post(`http://localhost:8080/message/sendMessage`,{content:newMsg,chatId:selectedChat._id},{withCredentials:true})
        socket.emit("new message",resp.data)
        SetMessages([...messages,resp.data])
        
        // console.log(resp.data);
        
      } catch (error) {
        toast({
          title: "Error occured while sending message",
          status: 'error',
          isClosable: true,
        })
        console.log(error);
      }
    }
  }



  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  
    if (selectedChat) {
      socket.emit(`joinChat`, selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on(`message recieved`, (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // Handle the case when the message is not for the current chat.
        if(!notification.includes(newMessageRecieved)){
          SetNotification([newMessageRecieved,...notification])
          setFetchAgain(!fetchChat)
        }
      } else {
      SetMessages([...messages, newMessageRecieved])
      }
    });
  });


  return (
    <>
      {selectedChat ? <>
      <Text
      fontSize={{base:"28px",md:"30px"}}
      pb={3}
      px={2}
      w={'100%'}
      display={'flex'}
      justifyContent={{base:"space-between"}}
      alignItems={'center'}
      >
        <Button display={{base:"flex",md:"none"}}
        onClick={()=>setSelectedChat("")}
        >
          <ArrowBackIcon/>
        </Button>
        <div></div>
        {!selectedChat.grpChat ? <>

        {getSender(user,selectedChat.users)}
        <UserPopUp user={getSenderFull(user,selectedChat.users)} />
        </> : <>
        {selectedChat.chatName.toUpperCase()}
        {<GroupChatModal fetchChat={fetchChat} setFetchAgain={setFetchAgain} fetchAllMessages={fetchAllMessages}/>}
        </>
              
         }
      </Text>
      <Box display={'flex'} flexDir={'column'} justifyContent={'flex-end'} p={3} w={'100%'} h={'100%'} borderRadius={'lg'} overflowY={'hidden'} bg={'#E8E8E8'}>
         {loading===true ? <Spinner width={'70px'} height={'70px'} alignSelf={'center'} size='xl' margin={'auto'} /> : 
         <div className='messages'>

         <GetAllMessages messages={messages} />
          

         </div>

         
         
         
        }
        <FormControl isRequired mt={3} onKeyDown={sendMessage}>
          {isTyping ? <div>Typing ...</div> : <>
          </>}
          <Input variant={'filled'} value={newMsg} onChange={handleTyping} placeholder='Type Your Message Here'/>
        </FormControl>
      </Box>
      </> : 
      <Box height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
              <Text fontSize={'3xl'} pb={3}>
                Click on a User to start chatting
              </Text>
        </Box>}
    </>
  )
}

export default SingleChat