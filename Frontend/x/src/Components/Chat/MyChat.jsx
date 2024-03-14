import React, { useContext, useEffect, useState } from 'react'
import { Box,Stack,Text,Button,VStack,Avatar ,Skeleton} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import UserContext from '../context/UserContext'

import AddIcon from '@mui/icons-material/Add';
import axios from "axios"
import { getSender } from '../Profile/ChatLogic';
import NewGrpModal from './NewGrpModal';

axios.defaults.withCredentials=true



const MyChat = ({fetchChat}) => {
  const toast = useToast()

    const {user,notification,SetNotification, setUser,selectedChat,setSelectedChat,chat, setChat} = useContext(UserContext)
    const [loggedUser,setLoggedUser]=useState(null)

    const fetchAllChats=async()=>{
        try {
            const getAllchats = await axios.get('http://localhost:8080/chat/getChats',{withCredentials:true})
            setChat(getAllchats.data.reverse())
            console.log(getAllchats.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        setLoggedUser(user)
        fetchAllChats()
    },[fetchChat])

    




  return (
   <Box display={{base:selectedChat ? "none" : "flex" ,md:"flex" }}
   flexDir={'column'}
   alignItems={'center'}
   p={3}
   bg={'aliceblue'}
   w={{base:"100%",md:"31%"}}
   borderRadius='lg'
   borderWidth={'1px'}
   >
        <Box pb={3} px={3} display={'flex'} width={'100%'} fontSize={{base:"29px",md:"32px"}} justifyContent={'space-between'} alignItems={'center'}>
            Chat Feed
        <NewGrpModal>
        <Button rightIcon={<AddIcon/>} display={'flex'} colorScheme='blue' alignItems={'center'}>
            New Club
        </Button>
        </NewGrpModal>
        </Box>
        <Box display={'flex'} flexDir={'column'} w={'100%'} h={'100%'} borderRadius={'lg'} overflowY={'hidden'} >
            {chat ?   <>
                <Stack overflowY={'scroll'}>
                    {chat.map((i)=>(
                        <Box
                        onClick={()=>setSelectedChat(i)}
                        cursor={'pointer'}
                        bg={selectedChat===i ? "#38B2AC" : "#E8E8E8"}
                        color={selectedChat===i ? "white" : "black"}
                        py={2}
                        px={2}
                        key={i._id}
                        borderRadius='lg'
                        >
                            <Text  p={2}>
                            {i.grpChat ? i.chatName : getSender(loggedUser, i.users)}
                            </Text>
                        </Box>
                    ))}
                </Stack>
            </> :  <Stack>
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
</Stack>}
        </Box>
   </Box>
  )
}

export default MyChat


