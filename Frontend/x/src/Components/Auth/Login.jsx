import React, { useState } from 'react'
import { Text,InputGroup,Button,InputRightElement, VStack ,FormControl,FormLabel,Input} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';
import {useNavigate} from "react-router-dom"
import axios from 'axios';



const Login = () => {

   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")
    const [show,setShow]=useState(false)

    const navigate =useNavigate()
    const handleClick=()=>{
        setShow(!show)
    }
    const toast =useToast()
    
    const handleLogin = async (e) => {
      e.preventDefault();
  
      if (!email || !password) {
          toast({
              title: 'Fill All the fields',
              status: 'warning',
              duration: 5000,
              isClosable: true,
          });
          return;
      }
  
      try {
          const resp = await axios.post('http://localhost:8080/auth/login', { email, password });
  
          if (resp.status===201) {
              toast({
                  title: 'User has Logged In',
                  description: 'Login Successful',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
              });
              navigate('/chat');
              window.location.reload()
          } else {
              toast({
                  title: 'Error has occurred',
                  description: 'Invalid credentials. Please try again.',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
              });
              navigate('/');
          }
      } catch (error) {
          console.log(error);
      }
  };
  

   
  return (
    <VStack spacing={'5px'}>
        <form onSubmit={handleLogin} style={{width:"100%"}}>
        <FormControl id='username' isRequired>
            <FormLabel>Email</FormLabel>
            <Input type='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}  isRequired/>
        </FormControl>
        <FormControl id='pw' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
            <Input type={show ? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' isRequired />
            <InputRightElement width="4.5rem">
            <Button height="1.75rem" size='sm' colorScheme='pink' onClick={handleClick}>
            {show ? "Hide" : "Show" }
            </Button>
        </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button  type='submit' my={2.5}  width={'100%'} colorScheme='pink'>Login</Button>
        <Text textAlign={'center'}>For Trial Use email : ggmu@gmail.com & Password : password</Text>
        </form>
    </VStack>
  )
}

export default Login