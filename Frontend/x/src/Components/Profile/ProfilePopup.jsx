import React from 'react'
import { useDisclosure } from '@chakra-ui/react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    HStack,
    Image,
    ModalCloseButton,Button,
  } from '@chakra-ui/react'

const ProfilePopup = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
      {children ? <p onClick={onOpen}>{children}</p> : <RemoveRedEyeIcon/> }
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pt={10}>
        <HStack alignItems={'center'} justifyContent={'center'}>
        <Image
        borderRadius='full'
        boxSize='120px'
        src={user.image}
        alt=''
        />
        </HStack>
         <HStack alignItems={'center'} justifyContent={'space-between'}>
         <ModalHeader>Username</ModalHeader>
          <ModalHeader>{user.username}</ModalHeader>
         </HStack>
         <HStack alignItems={'center'} justifyContent={'space-between'}>
         <ModalHeader>Email</ModalHeader>
          <ModalHeader>{user.email}</ModalHeader>
         </HStack>
         <HStack alignItems={'center'} justifyContent={'space-between'}>
         <ModalHeader>userId</ModalHeader>
          <ModalHeader>{user._id}</ModalHeader>
         </HStack>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme='red'  mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='blue' variant='ghost'>Edit Profile</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      </>
    )
}

export default ProfilePopup