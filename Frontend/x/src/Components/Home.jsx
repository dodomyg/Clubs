import React from 'react'
import { Container,Box,Text,Tabs,Tab,TabList,TabPanels,TabPanel } from '@chakra-ui/react'
import Register from './Auth/Register'
import Login from './Auth/Login'


const Home = () => {
  return (
    <Container maxW='xl' centerContent>
        
        <Box display={'flex'} bgColor={'aliceblue'} justifyContent={'center'} boxShadow='revert' m={'40px 0'} w='100%' borderRadius='md' borderWidth={'1px'}  p={2}>
            
            <Text as={'i'}  fontSize='xxx-large'>Clubs</Text>
        </Box>
        <Box w='100%' p={2} bgColor={'aliceblue'}  borderRadius='md' borderWidth={'1px'} >

        <Tabs variant='soft-rounded' colorScheme='pink'>
  <TabList p={2}>
    <Tab w={'50%'}>Register</Tab>
    <Tab w={'50%'}>Login</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Register/>
    </TabPanel>
    <TabPanel>
      <Login/>
    </TabPanel>
  </TabPanels>
</Tabs>

        </Box>

    </Container>
  )
}

export default Home