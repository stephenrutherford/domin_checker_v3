import Head from 'next/head'
import { Flex, Link, Heading, Stack, Button, Input, Table, Thead, Tbody, Tfoot, Tr, Th, Td, } from "@chakra-ui/react"
import { useState } from 'react'
import { CSVLink } from "react-csv";

export default function Home() {

  const [domains, setDomains] = useState([])
  const [input, setInput] = useState('')

  async function handleOnSubmit(e) {
    e.preventDefault();

    let arr = input.split(" ")

    // Removes whitespace from array
    arr = arr.filter(function (str) {
      return /\S/.test(str)
    })

    const postsResponse = await fetch("/api/search", {
      method: 'post',
      body: JSON.stringify(arr)
    })
    const postsData = await postsResponse.json()
    setDomains(postsData)

  }


  return (
    <Flex minW='100vw' minH='100vh' justifyContent='center' bgGradient="linear(to-b, #2193b0, #6dd5ed)">
      <Head>
        <title>Domain Checker v3</title>
        <meta name="description" content="A tool to check for disposable and invalid domains." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing={10} w='980px' alignItems='center' mt={10}>
        <Heading>
          Domain Checker v3
        </Heading>

        <Flex>
          <form onSubmit={handleOnSubmit} w='100%'>
            <Flex w='400px'>
              <Input size='lg' type='text' variant="outline" placeholder="Paste Domains Here" border='2px solid white' minW='100%' h='50px' focusBorderColor="green.200"
                value={input} onChange={(e) => { setInput(e.target.value) }} w='100%'
              />
            </Flex>
          </form>
        </Flex>

        <Flex w='100%' flexDirection='column' display={domains.length > 0 ? 'inherit' : 'none'}>
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <Th color='green.200' fontSize='md'>Domain</Th>
                <Th color='green.200' fontSize='md'>Disposable</Th>
                <Th color='green.200' fontSize='md'>Block</Th>
              </Tr>
            </Thead>
            <Tbody>
              {domains.map((e) => (
                <Tr key={e.domain} borderTop='1px solid LightBlue' borderBottom='1px solid LightBlue'>
                  <Td>
                    <Link
                      href={`https://check-mail.org/domain/${e.domain}`}
                      isExternal
                      textDecoration='underline'
                    >
                      {e.domain}
                    </Link>
                  </Td>
                  <Td>{e.disposable ? e.disposable.toString().toUpperCase() : ""}</Td>
                  <Td>{e.block ? e.block.toString().toUpperCase() : ""}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th color='green.200' fontSize='md'>Domain</Th>
                <Th color='green.200' fontSize='md'>Disposable</Th>
                <Th color='green.200' fontSize='md'>Block</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Flex>

        <CSVLink filename={"domain_results.csv"} data={domains.map((e) => (e))}>
          <Button variant="solid" colorScheme="green"
            display={domains.length > 0 ? 'inherit' : 'none'}
          >Download as CSV</Button>
        </CSVLink>
      </Stack>

    </Flex >
  )
}
