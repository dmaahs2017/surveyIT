import { NavBar } from "../components/NavBar";
import { List, ListItem, Heading, Image } from "@chakra-ui/core";

const Index = () => (
  <div>
    <NavBar />
    <div className="container">
      <Heading as="h1" className="title">
        Welcome To Survey IT!
      </Heading>
      <div className="columns">
        <div className="col1">
          <Heading as="h2" className="title">
            Quick Links:{" "}
          </Heading>
          <List>
            <ListItem>1</ListItem>
            <ListItem>2</ListItem>
            <ListItem>.</ListItem>
            <ListItem>.</ListItem>
            <ListItem>.</ListItem>
            <ListItem>n</ListItem>
          </List>
        </div>
        <div className="col2" style={{ width: "40%" }}>
          <h1>Get FREE rewards and figt cards by filling surveys!</h1>
          <h1>Take your first survey and earn $ in few minutes</h1>
        </div>
        <div className="col3">
          <div>
            <Image
              className="img"
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/52c29c52-488c-43d1-b38a-f244eb03a50f/de5wjmm-3bdd27f8-eac0-4e20-baf3-5349d0685870.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNTJjMjljNTItNDg4Yy00M2QxLWIzOGEtZjI0NGViMDNhNTBmXC9kZTV3am1tLTNiZGQyN2Y4LWVhYzAtNGUyMC1iYWYzLTUzNDlkMDY4NTg3MC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.R5qopRUz4NvAjAB7H2shEi7StKrKzNE965-H4IjA2CM"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Index;
