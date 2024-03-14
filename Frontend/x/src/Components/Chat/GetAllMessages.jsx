import React, { useContext } from 'react'
import { Box,Tooltip,FormControl,Button,Text,Heading,Menu,Avatar,VStack,Spinner ,MenuList,MenuButton,MenuItem,HStack,Input,Stack,Card,CardBody} from '@chakra-ui/react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSender, getSenderFull, isSameSender, isSameSenderMargin, isSameUser, lastMesseg } from '../Profile/ChatLogic';
import ScrollableFeed from 'react-scrollable-feed'
import { useToast } from '@chakra-ui/react'
import UserContext from '../context/UserContext';

const GetAllMessages = ({messages}) => {
    const {user, setUser,selectedChat,setSelectedChat,chat, setChat} = useContext(UserContext)
    if (!messages || messages.length === 0) {
        return <Text>No messages yet.</Text>;
      }
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i)=>(
            <div style={{display:'flex'}} key={m._id}>
                
                {
                    (isSameSender(messages,m,i,user._id)
                    || lastMesseg(messages,i,user._id)
                    ) && (
                        <>
                            <Avatar size='sm' m={2} mt={1} name={m.sender.fullName} />
                        </>
                    )
                }
                <span style={{backgroundColor:`${m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"}`,borderRadius:"20px",padding:"5px 15px",maxWidth:"75%",marginLeft:isSameSenderMargin(messages,m,i,user._id),marginTop:isSameUser(messages,m,i,user._id)? 3 : 10}}>{m.content}</span>
                </div>
        ))}
    </ScrollableFeed>
  )
}

export default GetAllMessages