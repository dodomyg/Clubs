import React, { useContext } from 'react'

import UserContext from '../context/UserContext'
import { Box,Tooltip,Button,Text,Heading,Menu,Avatar,VStack,Spinner ,MenuList,MenuButton,MenuItem,HStack,Input,Stack,Card,CardBody} from '@chakra-ui/react'
import SingleChat from './SingleChat'



const ChatBox = ({fetchChat,setFetchAgain}) => {

  const {user,chat,setChat,selectedChat,setSelectedChat}=useContext(UserContext)
  
  
  return (
    <Box display={{base:selectedChat ? "flex" : "none",md:'flex'}}
    alignItems={'center'}
    flexDir={'column'}
    p={3}
    bg={'aliceblue'}
    w={{base:"100%",md:"66%"}}
    borderRadius='lg'
    borderWidth={'1px'}
    >
    <SingleChat fetchChat={fetchChat} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox