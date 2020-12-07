import { useState } from "react";
import {
  Text,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/core";
import { InputField } from "./InputField";
import { Field, Formik, Form } from "formik";
import { usePayBalanceMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";

type PayBalanceModalProps = InputHTMLAttributes<HTMLInputElement> & {
  isOpen: any;
  onClose: any;
};

export const PayBalanceModal: React.FC<PayBalanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [payInFull, setPayInFull] = useState(false);
  const [paymentType, setPaymentType] = useState("CreditCard");
  const [, payBalance] = usePayBalanceMutation();
  const [me] = useMeQuery();
  const router = useRouter();
  if (!me.data?.me) {
    return <></>;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pay Balance</ModalHeader>
        <Text>Balance Owed: ${me.data.me.balance?.toFixed(2)}</Text>

        <Formik
          initialValues={{
            amount: me.data.me.balance,
            creditCard: "",
            routingNumber: "",
            accountNumber: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            let response = await payBalance({
              payInFull: payInFull,
              amount: payInFull ? null : values.amount,
              creditCard:
                paymentType === "CreditCard" ? values.creditCard : null,
              bankPaymentInfo:
                paymentType === "BankAccount"
                  ? {
                      accountNumber: values.accountNumber.toString(),
                      routingNumber: values.routingNumber.toString(),
                    }
                  : null,
            });

            if (response.data?.payBalance.errors) {
              setErrors(toErrorMap(response.data.payBalance.errors));
            } else {
              router.reload();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box mt={4}>
                <label>
                  <Field
                    type="checkbox"
                    name="isSurveyor"
                    onClick={() => setPayInFull(!payInFull)}
                  />
                  {"Pay Full Balance"}
                </label>
              </Box>

              {payInFull ? null : (
                <InputField
                  name="amount"
                  placeholder="0"
                  label="Payment Amount"
                />
              )}

              <Box mt={4}>
                <label>
                  {"Select Payment Type: "}
                  <select onChange={(v) => setPaymentType(v.target.value)}>
                    <option value="CreditCard">Credit Card</option>
                    <option value="BankAccount">Bank Account</option>
                  </select>
                </label>
              </Box>

              {paymentType === "CreditCard" ? (
                <InputField
                  type="number"
                  name="creditCard"
                  label="Credit Card:"
                  placeholder="000000000000"
                />
              ) : (
                <>
                  <InputField
                    type="number"
                    name="routingNumber"
                    label="Routing Number:"
                    placeholder="000000000"
                  />
                  <InputField
                    type="number"
                    name="accountNumber"
                    label="Account Number:"
                    placeholder="000000000000"
                  />
                </>
              )}

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Pay Balance
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
