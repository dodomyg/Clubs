import React, { useContext, useState } from 'react'
import { Box,Tooltip,Button,Text,Heading,Menu,Avatar,VStack,Spinner ,MenuList,MenuButton,MenuItem,HStack,Input,Stack,Card,CardBody} from '@chakra-ui/react'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'
import {getSender} from "../Profile/ChatLogic"


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
import UserContext from '../context/UserContext';
import { useDisclosure } from '@chakra-ui/react'
import ProfilePopup from '../Profile/ProfilePopup';
import { useToast } from '@chakra-ui/react';
import {useNavigate} from "react-router-dom"
import axios from "axios"
import UserSearchDisplay from './UserSearchDisplay';
import UserPopUp from './UserPopUp';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
axios.defaults.withCredentials=true

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading,setLoading]=useState(false)
  const [chatLoading,setCHatLoading]=useState(false)


  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const {user,notification,SetNotification,selectedChat,setSelectedChat,chat, setChat} = useContext(UserContext)
  const toast = useToast()

  const handleLogOut=async()=>{
    try {
      await axios.post(`http://localhost:8080/auth/logout`)
      toast({
        title: "Successfully Logged Out",
        status: 'success',
        isClosable: true,
      })
      
      navigate('/')
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error occured",
        status: 'error',
        isClosable: true,
      })
      console.log(error);
    }
  }

  const handleSearch=async()=>{
    if(!search){
      toast({
        title: 'Search is empty',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return;
    }
    try {
      setLoading(true)
      const searching = await axios.get(`http://localhost:8080/user/searchUser?search=${search}`,{withCredentials:true})
      setLoading(false)
      setSearchResult(searching.data.findUser);
      // console.log(searching.data.findUser);
    } catch (error) {
      console.log(error);
    }
  }


  const accessChat=async(userId)=>{
    if(!userId){
      toast({
        title: 'User not found',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
    try {
      setCHatLoading(true)
      const accessChat = await axios.post(`http://localhost:8080/chat/accessChat`,{userId},{withCredentials:true})
      if(!chat.find((i)=>i._id === accessChat.data._id))setSelectedChat([accessChat.data,...chat])
      setSelectedChat(accessChat.data)
      setCHatLoading(false)
      // console.log(accessChat.data);
      
      toast({
        title: 'Chat has been fetched',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Error occured while fetching',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      console.log(error);
    }
  }







  return (
  <>

<Box
        display={'flex'}
        justifyContent={'space-between'}
        p={2}
        alignItems={'center'}
        bgColor={'aliceblue'}
        w={'100%'}
        borderWidth={'3px'}
      >
        <Tooltip label="Search user" hasArrow placement='bottom'>
          <Button onClick={onOpen} variant={'ghost'}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} p={1}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text as='i' fontSize="3xl">
          Clubs
        </Text>
        <div style={{ display: "flex", alignContent: "center", marginRight: '5px' }}>
          <Menu>
            <MenuButton as={Button} variant={'ghost'} p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <BellIcon fontSize='2xl' margin={1} />
              {/* <Text display={{ base: "none", md: "flex" }} p={1}>
                Notifications
              </Text> */}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((noti) => (
                <MenuItem
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    SetNotification(notification.filter((n) => n !== noti));
                  }}
                  key={noti._id}
                >
                  
                  {noti.chat.grpChat
                    ? `New Message in ${noti.chat.chatName}`
                    : `New message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ArrowDropDownIcon />} variant={'ghost'}>
              <Avatar name={user.fullName} size={'sm'} />
            </MenuButton>
            <MenuList>
              <UserPopUp user={user}>
                <MenuItem>Profile</MenuItem>
              </UserPopUp>
              <hr />
              <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
  <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
        
          <DrawerBody >
          <Box  display={'flex'} gap={'10px'}>
            <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Enter user to search' />
            <Button onClick={handleSearch} colorScheme='blue'>Search</Button>
            </Box>
            {loading ? <Spinner size='xl' /> : 

              searchResult.map((i)=>(
                <UserSearchDisplay key={i._id} user={i} onClickFunction={()=>accessChat(i._id)} />
              ))
            }
            {chatLoading && <Spinner ml={'auto'} display={'flex'} size={'sm'} />}
          </DrawerBody>
        
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  
  </>
  )
}

export default SideBar