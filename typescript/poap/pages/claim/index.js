import Page from "../../components/Page";
import {
  VStack,
  Button,
  Link,
  Input,
  FormLabel,
  Box,
  Image,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import parseIpfs from "../../utils/parseIpfs";

import { useNFTCollection } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { SearchInput } from "@saas-ui/react";
export default function Create() {
  const [eventList, setEventList] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    fetch("/api/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEventList(data.events);
        }
      });
  }, []);
  useEffect(() => {
    if (search.length > 0 && search !== "") {
      const results = eventList.filter((event) =>
        event.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(results);
    } else {
      if (search === "") {
        setSearchResults(eventList);
      } else {
        setSearchResults([]);
      }
    }
  }, [search, eventList]);
  return (
    <Page
      title={"Claim NFTs"}
      subheading={"Choose the event you want to claim NFTs for"}
    >
      <Input
        width={"4xl"}
        placeholder="Search for an event"
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <SimpleGrid columns={2} spacing={10} marginTop={30} width={"4xl"}>
        {searchResults.map((event) => {
          return (
            <Box
              key={event.id}
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Image src={parseIpfs(event.image)} alt={event.name} />

              <Box p="6">
                <Box display="flex" alignItems="baseline">
                  <Badge borderRadius="full" px="2" colorScheme="teal">
                    {event.chain}
                  </Badge>
                </Box>

                <Box
                  mt="1"
                  fontWeight="semibold"
                  as="h4"
                  lineHeight="tight"
                  isTruncated
                >
                  {event.name}
                </Box>

                <Box>{event.description}</Box>
                <Box>
                  <Link href={`/claim/${event.id}`}>
                    <Button>Claim NFT</Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>
    </Page>
  );
}
