import React from "react";
import { Formik, Field, Form } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { Select } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { NavBar } from "../components/NavBar";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{
            username: "",
            email: "",
            phoneNumber: "",
            typeOfUser: "",
            isSurveyor: false,
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            values.typeOfUser = values.isSurveyor ? "surveyor" : "surveyee";
            const response = await register(values);
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
              console.log(response.data.register.errors);
            } else if (response.data?.register.user) {
              if (values.isSurveyor) {
                router.push("/surveyorDash");
              } else {
                router.push("/surveyeeDash");
              }
            } else {
              console.log(response);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputField
                  name="email"
                  placeholder="email@domain.com"
                  label="Email"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="phoneNumber"
                  placeholder="123456789"
                  label="Phone Number"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>

              <Box mt={4}>
                Gender
                <Select placeholder= "Select Gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </Box>

              <Box mt={4}>
                Income
                <Select placeholder= "Select Income">
                  <option value="0to20">$0 to $20,000</option>
                  <option value="20to40">$20,000 to $40,000</option>
                  <option value="40to60">$40,000 to $60,000</option>
                  <option value="60to80">$60,000 to $80,000</option>
                  <option value="80to100">$80,000 to $100,000</option>
                  <option value="100to200">$100,000 to $200,000</option>
                  <option value="200to300">$200,000 to $300,000</option>
                  <option value="300to400">$300,000 to $400,000</option>
                  <option value="400to500">$400,000 to $500,000</option>
                  <option value="500to600">$500,000 to $600,000</option>
                  <option value="600to700">$600,000 to $700,000</option>
                  <option value="700to800">$700,000 to $800,000</option>
                  <option value="800to900">$800,000 to $900,000</option>
                  <option value="900to1000">$900,000 to $1,000,000</option>
                  <option value="1000+">$1,000,000+</option>
                </Select>
              </Box>

              <Box mt={4}>
                <label>
                  <Field type="checkbox" name="isSurveyor" />
                  {" Check here if making a surveyor account"}
                </label>
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
      </Wrapper>
    </>
  );
};

export default Register;
