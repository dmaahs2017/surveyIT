import React, { useState } from "react";
import { toErrorMap } from "../utils/toErrorMap";
import { NavBar } from "../components/NavBar";
import { Heading, Avatar, Text, Button, Box, Flex } from "@chakra-ui/core";
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
            <div style={{ textAlign: "center" }}>
              <Avatar />
            </div>
            <Text style={{ textAlign: "center" }}>{data?.me?.username}</Text>
            <Text className="fieldName">Name</Text>
            <p className="fieldValue">{data?.me?.username}</p>
            <Text className="fieldName">Email</Text>
            <p className="fieldValue">{data?.me?.email}</p>
            <Text className="fieldName">Phone Number</Text>
            <p className="fieldValue">{data?.me?.phoneNumber}</p>
            <Text className="fieldName">Gender</Text>
            <p className="fieldValue">{data?.me?.gender}</p>
            <Text className="fieldName">Income</Text>
            <p className="fieldValue">{data?.me?.income}</p>
          
            <br></br>
            <Button mt={4} variantColor="teal" onClick={() => setEdit(!edit)}>
              Edit Account
            </Button>
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
            <Avatar style={{ marginLeft: "21.5vw" }} />
            <Text style={{ textAlign: "center" }}>{data?.me?.username}</Text>
            <Formik
              initialValues={
                data?.me
                  ? {
                      username: data.me.username,
                      email: data.me.email,
                      phoneNumber: data.me.phoneNumber,
                      gender: data.me.gender,
                      income: data.me.income
                    }
                  : {
                      username: "",
                      email: "",
                      phoneNumber: "",
                      gender: "",
                      income: "",
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

                  <Box mt={4}>
                    <InputField label="gender" name="gender" as="select">
                      <option value="">Please select a gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </InputField>
                  </Box>

                  <Box mt={4}>
                    <InputField label="Income" name="income" as="select">
                      <option value="">
                        Please select a yearly income estimate
                      </option>
                      <option value="$0 to $20,000">$0 to $20,000</option>
                      <option value="$20,000 to $40,000">
                        $20,000 to $40,000
                      </option>
                      <option value="$40,000 to $60,000">
                        $40,000 to $60,000
                      </option>
                      <option value="$60,000 to $80,000">
                        $60,000 to $80,000
                      </option>
                      <option value="$80,000 to $100,000">
                        $80,000 to $100,000
                      </option>
                      <option value="$100,000 to $200,000">
                        $100,000 to $200,000
                      </option>
                      <option value="$200,000 to $300,000">
                        $200,000 to $300,000
                      </option>
                      <option value="$300,000 to $400,00">
                        $300,000 to $400,000
                      </option>
                      <option value="$400,000 to $500,00">
                        $400,000 to $500,000
                      </option>
                      <option value="$500,000 to $600,000">
                        $500,000 to $600,000
                      </option>
                      <option value="$600,000 to $700,000">
                        $600,000 to $700,000
                      </option>
                      <option value="$700,000 to $800,000">
                        $700,000 to $800,000
                      </option>
                      <option value="$800,000 to $900,000">
                        $800,000 to $900,000
                      </option>
                      <option value="$900,000 to $1,000,000">
                        $900,000 to $1,000,000
                      </option>
                      <option value="$1,000,000+">$1,000,000+</option>
                    </InputField>
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
