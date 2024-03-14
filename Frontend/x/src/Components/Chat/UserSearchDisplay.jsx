import React from 'react'
import { Box,Tooltip,Button,Text,Heading,Menu,Avatar,VStack ,MenuList,MenuButton,MenuItem,HStack,Input,Stack,Card,CardBody} from '@chakra-ui/react'


const UserSearchDisplay = ({user,onClickFunction}) => {
  return (
    <Box mt={2} onClick={onClickFunction} cursor={'pointer'} px={4} p={2} _hover={{
      background:"#38B2AC",
      color:"white"
    }} bgColor='ButtonFace' borderRadius='lg' gap={'10px'} width={"100%"} display={'flex'} alignItems={'center'} mb={2}>
        <Avatar size='sm' name={user.fullName}/>
        <Box>
            <Text>{user.fullName}</Text>
            <Text fontSize='sx'>{user.email}</Text>
        </Box>


    </Box>
  )
}

export default UserSearchDisplay