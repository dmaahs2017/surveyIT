import React, { useState } from "react";
import { toErrorMap } from "../utils/toErrorMap";
import { NavBar } from "../components/NavBar";
import { Heading, Avatar, Text, Button, Box } from "@chakra-ui/core";
import { useUpdateUserMutation, useMeQuery } from "../generated/graphql";
import { InputField } from "../components/InputField";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";

const manageAccount: React.FC<{}> = ({}) => {
  const [{ data }] = useMeQuery();
  const [, updateUser] = useUpdateUserMutation();
  const [edit, setEdit] = useState(false);
  const router = useRouter();
  //if use doesn't want to edit
  if (!edit) {
    return (
      <div>
        <NavBar />
        <Heading style={{ textAlign: "center" }}>Account</Heading>
        <div className="container">
          <div className="userInfo">
            <Avatar style={{ marginLeft: "22.5vw" }} />
            <Text style={{ textAlign: "center" }}>{data?.me?.username}</Text>
            {/* delte from here */}
            <Text className="fieldName">Name</Text>
            <p className="fieldValue">{data?.me?.username}</p>
            <Text className="fieldName">Email</Text>
            <p className="fieldValue">{data?.me?.email}</p>
            <Text className="fieldName">Phone Number</Text>
            <p className="fieldValue">{data?.me?.phoneNumber}</p>
            {/*<Text>Income</Text>
          <p>{data?.me?.income}</p>
          <input className="simpleField" type="text" />
          <p>{data?.me?.education}</p>
          <input className="simpleField" type="text" />
          <Text>Gender</Text>
          <p>{data?.me?.gender}</p>
          */}
            <br></br>
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
        <Heading style={{ textAlign: "center" }}>Account</Heading>
        <div className="container">
          <div className="userInfo">
            <Avatar style={{ marginLeft: "22.5vw" }} />
            <Text style={{ textAlign: "center" }}>AccountName</Text>
            <Formik
              initialValues={
                data?.me
                  ? {
                      username: data.me.username,
                      email: data.me.email,
                      phoneNumber: data.me.phoneNumber,
                    }
                  : {
                      username: "",
                      email: "",
                      phoneNumber: "",
                    }
              }
              onSubmit={async (values, { setErrors }) => {
                console.log(values);
                const response = await updateUser(values);
                if (response.data?.updateUser.errors) {
                  setErrors(toErrorMap(response.data?.updateUser.errors));
                } else if (response.data?.updateUser.user) {
                  setEdit(false);
                }
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
                    Update
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
};

export default manageAccount;
