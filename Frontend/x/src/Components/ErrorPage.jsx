import React from 'react'
import {Box,Button,Center,
  Alert,
  Stack,
  AlertIcon,
} from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"


const ErrorPage = () => {
  const navigate=useNavigate()

  const redirectToHome=(e)=>{
    e.preventDefault()
    navigate('/')
  }


  return (
    <Stack h={'100vh'} alignItems={'center'} justifyContent={'center'} spacing={4}>
      <Center>
    <Alert status='error'>
    
    <AlertIcon />
    To Have Access to this page , you have to login
  </Alert>
  </Center>
  <Button colorScheme="teal" onClick={redirectToHome}>
              Go to Home
    </Button>

    </Stack>

  )
}

export default ErrorPage