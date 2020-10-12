import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Heading, Avatar, Text, Button, Input, Box } from "@chakra-ui/core";
import { useMeQuery } from "../generated/graphql";
import { InputField } from "../components/InputField";
import { Form, Formik } from "formik";

const manageAccount: React.FC<{}> = ({}) => {
  const [{ data }] = useMeQuery();
  const [edit, setEdit] = useState(false);
  //if use doesn't want to edit
  if(!edit)
  {
  return (
    <div>
      <NavBar />
      <Heading style={{textAlign:"center"}}>Account</Heading>
      <div className="container">
        <div className="userInfo">
          <Avatar style={{marginLeft:"22.5vw"}} />
          <Text style={{ textAlign: "center" }}>AccountName</Text>
          {/* delte from here */}
          <Text>Name</Text>
            <p>{data?.me?.username}</p>
          <Text>Email</Text>
            <p>{data?.me?.email}</p>
          <Text>Phone Number</Text>
          <p>{data?.me?.phoneNumber}</p>
          {/*<Text>Income</Text>
          <p>{data?.me?.income}</p>
          <input className="simpleField" type="text" />
          <p>{data?.me?.education}</p>
          <input className="simpleField" type="text" />
          <Text>Gender</Text>
          <p>{data?.me?.gender}</p>
          */}
          <Button onClick={() => setEdit(!edit)}>Edit Account</Button>
          {/* To Here */}
        </div>
      </div>
    </div>
  );
  }
  //if user wants to edit
  else
  return (
    <div>
      <NavBar />
      <Heading style={{textAlign:"center"}}>Account</Heading>
      <div className="container">
        <div className="userInfo">
          <Avatar style={{marginLeft:"22.5vw"}} />
          <Text style={{ textAlign: "center" }}>AccountName</Text>
          <Formik
          initialValues={{
            username: data?.me?.username,
            email: data?.me?.email,
            phoneNumber: data?.me?.phoneNumber,
          }}
          onSubmit={async (values, { setErrors }) => {
            console.log(values);
          }}
        >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="username"
                placeholder={data?.me?.username}
                label="Username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="email"
                placeholder={data?.me?.username}
                label="Email"
              />
            </Box>
            <Box mt={4}>
              <InputField
              name="phoneNumber"
              placeholder={data?.me?.username}
              label="Phone Number"
              />
            </Box>
            <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Register
              </Button>
          </Form>
        )}
        </Formik>
        </div>
      </div>
    </div>
  )
};

export default manageAccount;
