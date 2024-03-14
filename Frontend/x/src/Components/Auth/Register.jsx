import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"
import {
  Stack,
  InputGroup,
  HStack,
  Button,
  InputRightElement,
  VStack,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const Register = () => {


  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)

  const toggleShow=()=>{
    setShow(!show)
  }

  
  const toast = useToast()
  const [formData, setFormData] = useState({
    fullName:'',
    email: '',
    password: '',
    cpw: '',
  });
  const navigate = useNavigate()

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister=async(e)=>{
    e.preventDefault();
      try {
        await axios.post('http://localhost:8080/auth/register',formData)
        toast({
          title: 'Account created.',
          description: "Registration successful,now you can login",
          status: 'success',
          duration: 5000,
          isClosable:true,
        })
      } catch (error) {
        toast({
          title: 'Error occured',
          description: "Please try again later",
          status: 'error',
          duration: 5000,
          isClosable:true,
        })
        console.log(error);
      }
  }
  
    




  return (
    <VStack spacing={'5px'}>
      <form style={{width:"100%"}} onSubmit={handleRegister}>
      <FormControl>
      <FormLabel htmlFor="email">Full Name</FormLabel>
            <Input
              type="fullName"
              id="fullName"
              name="fullName"
              placeholder='Full Name'
              value={formData.fullName}
              onChange={handleChange}
              isRequired
            />
          </FormControl>
      <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isRequired
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
            <Input
              type={show ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isRequired
            />
            <InputRightElement width="4.5rem">
            <Button height="1.75rem" size='sm' colorScheme='pink' onClick={toggleShow}>
            {show ? "Hide" : "Show" }
            </Button>
          </InputRightElement>
          </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="cpw">Confirm Password</FormLabel>
            <InputGroup size="md">
            <Input
              type={show ? 'text' : 'password'}
              id="cpw"
              name="cpw"
              value={formData.cpw}
              onChange={handleChange}
              isRequired
            />
            <InputRightElement width="4.5rem">
            <Button height="1.75rem" size='sm' colorScheme='pink' onClick={toggleShow}>
            {show ? "Hide" : "Show" }
            </Button>
          </InputRightElement>
          </InputGroup>
          </FormControl>
      
      <Button type='submit' my={2.5} width={'100%'} colorScheme='pink'>
        Register
      </Button>
      </form>
    </VStack>
  );
};

export default Register;
