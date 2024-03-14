import React, { useContext, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    FormControl,
    Spinner,
    Input,
    Button,
    ModalBody,
    ModalCloseButton,
    Box
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
  import axios from "axios"
import UserSearchDisplay from './UserSearchDisplay'
import { useToast } from '@chakra-ui/react'
import UserBadge from './UserBadge'
import UserContext from '../context/UserContext'
  axios.defaults.withCredentials=true

const NewGrpModal = ({children}) => {
    
    const toast = useToast()
    const {user,chat,setChat}=useContext(UserContext)


    const { isOpen, onOpen, onClose } = useDisclosure()
    const [grpName, setgrpName] = useState("");
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState("")
    const [searchResults,setSearchResults]=useState([])
    const [loading,setLoading]=useState(false)

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

    const addedGrp=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already exists",
                status: 'warning',
                isClosable: true,
              })
              return;
        }
        
        setSelectedUsers(selectedUsers => [...selectedUsers, userToAdd]);
        console.log(selectedUsers);
        
    }

    
    const handleSubmit = async () => {
        if (!grpName || selectedUsers.length < 2) {
          toast({
            title: 'Fill all credentials and add at least 2 users',
            status: 'warning',
            isClosable: true,
          });
          return;
        }
    
        try {
          const { data } = await axios.post('http://localhost:8080/chat/createGrpChat', {
            grpName,
            allUsers: selectedUsers.map((user) => user._id),
          });
    
          // Assuming you have a state variable named chat to update
          setChat((prevChat) => [data, ...prevChat]);
    
          onClose();
          toast({
            title: 'New Grp created',
            status: 'success',
            isClosable: true,
          });
          setgrpName("")
          setSelectedUsers([])
        } catch (error) {
          toast({
            title: 'Error while creating',
            status: 'error',
            isClosable: true,
          });
          console.log(error);
        }
      };

    

    const removeUser = (userIdToRemove) => {
        setSelectedUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userIdToRemove)
        );
      };


  return (
    <div>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={'flex'} justifyContent={'center'} fontSize={'35px'}>Create New Club</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
            <FormControl>
            <Input type='text' mb={2} placeholder='Enter Club Name' value={grpName} onChange={(e)=>setgrpName(e.target.value)}/>
            </FormControl>
            <FormControl>
            <Input type='' mb={1} placeholder='Add Users' onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
            {selectedUsers.map(u=>(
                <UserBadge key={u._id} user={u} onClick={()=>removeUser(u._id)} />
            ))}
            </Box>
            
            {loading ? <Spinner size='sm'/> : 

            searchResults.slice(0,4).map((u)=>(
                <UserSearchDisplay key={u._id} user={u} onClickFunction={()=>addedGrp(u)}/>
            ))
            
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NewGrpModal