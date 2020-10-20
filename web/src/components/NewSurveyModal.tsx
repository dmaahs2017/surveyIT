import {
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
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
        <ModalHeader>Create New Survey</ModalHeader>

        <Formik
          initialValues={{ name: "", desc: "" }}
          onSubmit={async (values, { setErrors }) => {
            if (values.name !== "" && values.desc !== "") {
              const response = await createSurvey({
                name: values.name,
                description: values.desc,
              });
              if (response.data)
                router.push(`/server/edit/${response.data?.createSurvey.id}`);
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
                label="Name"
              />
              <InputField
                name="desc"
                placeholder="Enter a description for your survey"
                label="Description"
              />
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Submit Question
              </Button>
            </Form>
          )}
        </Formik>
        <ModalCloseButton />
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
};
