import React from "react";
import { NavBar } from "../components/NavBar";
import { Heading, Avatar, Text, Button } from "@chakra-ui/core";

const manageAccount: React.FC<{}> = ({}) => {
  return (
    <div>
      <NavBar />
      <Heading>Account</Heading>
      <div className="container">
        <div className="userInfo">
          <Avatar />
          <Text style={{ textAlign: "center" }}>AccountName</Text>
          {/* delte from here */}
          <Text>Name</Text>
          <input className="simpleField" type="text" />
          <Text>Email</Text>
          <input className="simpleField" type="email" />
          <Text>Password</Text>
          <input className="simpleField" type="password" />
          <Text>Phone Number</Text>
          <input className="simpleField" type="text" />
          <Text>Income</Text>
          <input className="simpleField" type="text" />
          <Text>Education</Text>
          <input className="simpleField" type="text" />
          <Text>Gender</Text>
          <input className="simpleField" type="text" />
          <Text></Text>
          <Button>Edit Account</Button>
          {/* To Here */}
        </div>
      </div>
    </div>
  );
};

export default manageAccount;
