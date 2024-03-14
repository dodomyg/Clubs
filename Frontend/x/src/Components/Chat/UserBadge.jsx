import React from 'react'
import { Box,Tooltip,Button,Text,Heading,Menu,Avatar,VStack,Spinner ,MenuList,MenuButton,MenuItem,HStack,Input,Stack,Card,CardBody} from '@chakra-ui/react'
import CloseIcon from '@mui/icons-material/Close';

const UserBadge = ({user,onClick}) => {
  return (
    <Box
    key={user._id}
    px={2} 
    py={1}
    display={'flex'}
    alignContent={'center'}
    m={1}
    borderRadius='lg'
    mb={2}
    cursor={'pointer'}
    onClick={onClick}
    color={'white'}
    bgColor={'purple'}
    >
        {user.fullName}
        <CloseIcon/>
    </Box>
  )
}

export default UserBadge