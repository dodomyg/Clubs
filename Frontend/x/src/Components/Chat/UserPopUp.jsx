import React from 'react'
import { useDisclosure,IconButton } from '@chakra-ui/react'

import InfoIcon from '@mui/icons-material/Info';
import {
  HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    Text,
    Avatar,
    VStack,
    ModalHeader,
    Button,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const UserPopUp = ({user,children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    



  return (
    <>
    { children ? <span onClick={onOpen}>{children}</span> : <IconButton display={'flex'} icon={<InfoIcon/>} onClick={onOpen} />}
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems={'center'}>
            <Avatar size='xl' name={user.fullName} />
            </VStack>
            <HStack my={2} align={'center'} justifyContent={'space-between'}>
                <Text>Full Name</Text>
                <Text>{user.fullName}</Text>
            </HStack>
            <HStack my={2} align={'center'} justifyContent={'space-between'}>
                <Text>Email</Text>
                <Text>{user.email}</Text>
            </HStack>
            <HStack my={2} align={'center'} justifyContent={'space-between'}>
                <Text>User Id</Text>
                <Text>{user._id}</Text>
            </HStack>
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UserPopUp