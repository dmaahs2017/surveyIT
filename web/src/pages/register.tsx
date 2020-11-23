import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Box, Button } from "@chakra-ui/core";
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
  const [isSurveyor, setIsSurveyor] = useState(false);
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
            gender: "",
            income: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            values.typeOfUser = values.isSurveyor ? "surveyor" : "surveyee";
            console.log(values);
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

              {isSurveyor ? null : (
                <>
                  <Box mt={4}>
                    Gender:
                    <Field name="gender" as="select">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                  </Box>

                  <Box mt={4}>
                    Income:
                    <Field name="income" as="select">
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
                    </Field>
                  </Box>
                </>
              )}

              <Box mt={4}>
                <label>
                  <Field
                    type="checkbox"
                    name="isSurveyor"
                    onClick={() => setIsSurveyor(!isSurveyor)}
                  />
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
