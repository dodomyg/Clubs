import React, { useContext, useState } from 'react'
import InfoIcon from '@mui/icons-material/Info';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    FormControl,
    IconButton,
    Spinner,
    Input,
    Button,
    ModalBody,
    ModalCloseButton,
    Box
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
import UserContext from '../context/UserContext';
import UserBadge from './UserBadge';
import UserSearchDisplay from './UserSearchDisplay';
import { useToast } from '@chakra-ui/react'

import axios from "axios"
axios.defaults.withCredentials=true


const GroupChatModal = ({fetchChat,setFetchAgain,fetchAllMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  const {user, setUser,selectedChat,setSelectedChat,chat, setChat} = useContext(UserContext)

  const [grpChatName,setGrpCHatName]=useState("")
  const [searchResults,setSearchResults]=useState([])
  const [search,setSearch]=useState("")
  const [loading,setLoading]=useState(false)
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast()

  const handleRemove=async(userToRemove)=>{
    // if(selectedChat.users.find((u)=>u._id!==userToRemove._id)){
    //     toast({
    //         title: "User Not in group",
    //         status: 'warning',
    //         isClosable: true,
    //       })
    //       return;
    // }
    if(selectedChat.admin !== user._id){
        toast({
            title: "Only Admin Can Remove Users",
            status: 'warning',
            isClosable: true,
          })
          return;
    }
    try {
        setLoading(true)
        const removeFromgrp=await axios.put(`http://localhost:8080/chat/deleteFromGrp`,{
            chatId:selectedChat._id,
            userId:userToRemove._id
        },{withCredentials:true})

        userToRemove._id===user._id ? setSelectedChat() : setSelectedChat(removeFromgrp.data)
        setFetchAgain(!fetchChat)
        
        setLoading(false)
        toast({
            title: "User deleted successfuly",
            status: 'success',
            isClosable: true,
          })
        //   window.location.reload()
        fetchAllMessages()
    } catch (error) {
        console.log(error);
    }


  }

  const handleRename=async()=>{
    if(!grpChatName){
        return;
    }
    try {
        
        if(selectedChat.admin === user._id){
            setRenameLoading(true)
            const renameGrp = await axios.put(`http://localhost:8080/chat/rename`,{
                chatId:selectedChat._id,
                chatName:grpChatName
            },{withCredentials:true})
            setSelectedChat(renameGrp.data)
            setFetchAgain(!fetchChat)
            console.log(renameGrp.data);

            setRenameLoading(false)
            toast({
                title: "Club Name Updated",
                status: 'success',
                isClosable: true,
              })
        }else{
            setRenameLoading(false)
            toast({
                title: "Only Admin Can Update the Club Name",
                status: 'warning',
                isClosable: true,
              })
              return
        }
        // console.log(selectedChat.admin)
        // console.log(user._id);
        
    } catch (error) {
        console.log(error);
    }

  }
  const handleSearch=async(query)=>{
    setSearch(query)
    if(!query){
        return;
    }
    try {
        setLoading(true)
        const searching = await axios.get(`http://localhost:8080/user/searchUser?search=${search}`,{withCredentials:true})
        setLoading(false)
        setSearchResults(searching.data.findUser)
        // console.log(searching.data.findUser);
    } catch (error){
        console.log(error);
    }
}

const addUser=async(userToAdd)=>{
    if(selectedChat.users.find((u)=>u._id===userToAdd._id)){
        toast({
            title: "User Already in the group",
            status: 'warning',
            isClosable: true,
          })
          return;
    }
    if(selectedChat.admin !== user._id){
        toast({
            title: "Only Admin Can Add Users",
            status: 'warning',
            isClosable: true,
          })
          return;
    }
    try {
        setLoading(true)
        const addTogrp=await axios.put(`http://localhost:8080/chat/addToGrp`,{
            chatId:selectedChat._id,
            userId:userToAdd._id
        },{withCredentials:true})
        setSelectedChat(addTogrp.data)
        setFetchAgain(!fetchChat)
        setLoading(false)
        toast({
            title: "User added successfuly",
            status: 'success',
            isClosable: true,
          })
        //   window.location.reload()
    } catch (error) {
        console.log(error);
    }
}


    
  return (
    <>
    <IconButton display={'flex'} icon={<InfoIcon/>} onClick={onOpen}/>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
    fontSize={'28px'}
    mt={2}
    display={'flex'}
    alignItems={'center'}
    justifyContent={'center'}
    >{selectedChat.chatName}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
        Members
        <hr/>
      <Box alignItems={'center'} display={'flex'} flexWrap={'wrap'}>
        {selectedChat.users.map((i)=>(
            <UserBadge key={i._id} user={i} onClick={()=>handleRemove(i)} />
        ))}
      </Box>
      <FormControl mt={2} display={'flex'} alignItems={'center'} gap={'10px'}>
        <Input  placeholder='Update Club Name' value={grpChatName} onChange={(e)=>setGrpCHatName(e.target.value)}  />
        <Button variant={'solid'} colorScheme='blue' isLoading={renameLoading} onClick={handleRename}>Update</Button>
      </FormControl>
      <FormControl mt={2}>
            <Input type='' mb={1} placeholder='Add Users' onChange={(e)=>handleSearch(e.target.value)}/>
        </FormControl>
        {loading ? <Spinner size='sm'/> : 

            searchResults.slice(0,4).map((u)=>(
                <UserSearchDisplay key={u._id} user={u} onClickFunction={()=>addUser(u)} />
            ))
            
            }
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
        Leave Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  )
}

export default GroupChatModal