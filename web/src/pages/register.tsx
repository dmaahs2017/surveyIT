import React from "react";
import { label, Formik, Field, Form } from "formik";
import { Text, Checkbox, Box, Button } from "@chakra-ui/core";
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
