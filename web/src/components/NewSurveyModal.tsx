import {
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  Box,
} from "@chakra-ui/core";
import { InputField } from "./InputField";
import { Formik, Form } from "formik";
import { useCreateSurveyMutation } from "../generated/graphql";
import { useRouter } from "next/router";

type NewSurveyModalProps = InputHTMLAttributes<HTMLInputElement> & {
  isOpen: any;
  onClose: any;
};

export const NewSurveyModal: React.FC<NewSurveyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [, createSurvey] = useCreateSurveyMutation();
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Box maxW="90%" ml="3vw" mr="3vw">
          <ModalHeader>Create New Survey</ModalHeader>

          <Formik
            initialValues={{
              name: "",
              desc: "",
              moneyAllocated: 0.0,
              numGuarenteedResponses: 0,
            }}
            onSubmit={async (values, { setErrors }) => {
              if (values.name !== "" && values.desc !== "") {
                const response = await createSurvey({
                  name: values.name,
                  allocatedMoney: values.moneyAllocated,
                  numGuarenteedResponses: values.numGuarenteedResponses,
                  description: values.desc,
                });
                if (response.data)
                  router.push(`/survey/${response.data?.createSurvey.id}`);
              } else {
                setErrors({
                  name: "Please enter a value",
                  desc: "Please enter a value",
                });
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="name"
                  placeholder="Enter new survey name"
                  label="Name:"
                />
                <InputField
                  name="desc"
                  placeholder="Enter a description for your survey"
                  label="Description:"
                />
                <InputField
                  type="number"
                  name="moneyAllocated"
                  label="Allocate money to survey"
                  placeholder="0.00"
                />
                <InputField
                  type="number"
                  name="numGuarenteedResponses"
                  label="Buy Guarenteed Responses"
                  placeholder="0"
                />
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  variantColor="teal"
                >
                  Create Survey
                </Button>
              </Form>
            )}
          </Formik>
          <ModalCloseButton />
          <ModalBody></ModalBody>
        </Box>
      </ModalContent>
    </Modal>
  );
};
