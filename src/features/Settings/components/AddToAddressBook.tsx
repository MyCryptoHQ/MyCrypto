import { useState } from 'react';

import { Button } from '@mycrypto/ui';
import { Field, FieldProps, Form, Formik } from 'formik';
import styled from 'styled-components';
import { object, string } from 'yup';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import { DashboardPanel, InputField, NetworkSelector } from '@components';
import GeneralLookupField from '@components/GeneralLookupField';
import { DEFAULT_NETWORK } from '@config/constants';
import { useToasts } from '@features/Toasts';
import { useContacts, useNetworks } from '@services';
import { isValidETHAddress } from '@services/EthService';
import { translateRaw } from '@translations';
import { Contact, NetworkId } from '@types';

const AddToAddressBookPanel = styled(DashboardPanel)`
  padding: 24px 30px;
`;

const BackButton = styled(Button)`
  margin-right: 16px;
`;

const AddressFieldset = styled.fieldset`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 9px;
    color: #163150;
  }
  input,
  textarea {
    display: block;
    width: 100%;
  }
`;

const AddressBookButtons = styled.div`
  button {
    &:first-of-type {
      margin-right: 12px;
    }
  }
`;

const SNetworkSelector = styled(NetworkSelector)`
  margin-bottom: 15px;
`;

interface Props {
  toggleFlipped(): void;
  createContact(values: Contact): void;
}

export default function AddToAddressBook({ toggleFlipped, createContact }: Props) {
  const { getContactByAddress } = useContacts();
  const { getNetworkById } = useNetworks();
  const [isResolvingDomain, setIsResolvingDomain] = useState(false);

  const Schema = object().shape({
    label: string().required(translateRaw('REQUIRED')),
    address: object()
      .test('check-eth-address', translateRaw('TO_FIELD_ERROR'), (value) =>
        isValidETHAddress(value.value)
      )
      .test('doesnt-exist', translateRaw('ADDRESS_ALREADY_ADDED'), function (value) {
        const contact = getContactByAddress(value.value);
        if (contact !== undefined) {
          return this.createError({
            message: translateRaw('ADDRESS_ALREADY_ADDED', { $label: contact.label })
          });
        }
        return true;
      })
  });

  const { displayToast, toastTemplates } = useToasts();

  return (
    <AddToAddressBookPanel
      heading={
        <>
          <BackButton basic={true} onClick={toggleFlipped}>
            <img src={backArrowIcon} alt="Back" />
          </BackButton>
          {translateRaw('ADDRESS_BOOK_TABLE_ADD_ADDRESS')}
        </>
      }
      padChildren={true}
    >
      <Formik
        validationSchema={Schema}
        initialValues={{
          label: '',
          address: {
            value: '',
            display: ''
          },
          notes: '',
          network: DEFAULT_NETWORK
        }}
        onSubmit={(values, { setSubmitting }) => {
          createContact({ ...values, address: values.address.value });
          setSubmitting(false);
          displayToast(toastTemplates.addedAddress, { label: values.label });
          toggleFlipped();
        }}
      >
        {({
          isSubmitting,
          errors,
          values,
          touched,
          setFieldValue,
          setFieldError,
          setFieldTouched
        }) => (
          <Form>
            <AddressFieldset>
              <label htmlFor="label">{translateRaw('ACCOUNT_LIST_LABEL')}</label>
              <Field name="label">
                {({ field }: FieldProps<string>) => (
                  <InputField
                    {...field}
                    placeholder={translateRaw('ADDRESS_BOOK_NAME_OF_ADDRESS_PLACEHOLDER')}
                  />
                )}
              </Field>
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="address">{translateRaw('ADDRESSBOOK_ADDRESS')}</label>
              <GeneralLookupField
                name="address"
                value={values.address}
                options={[]}
                isResolvingName={isResolvingDomain}
                setIsResolvingDomain={setIsResolvingDomain}
                network={getNetworkById(values.network)}
                error={
                  errors && touched.address && errors.address
                    ? (errors.address as string)
                    : undefined
                }
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
                placeholder={translateRaw('ADDRESSBOOK_ADDRESS_PLACEHOLDER')}
              />
            </AddressFieldset>
            <AddressFieldset>
              <Field name="network">
                {({ field, form }: FieldProps<NetworkId>) => (
                  <SNetworkSelector
                    network={field.value}
                    onChange={(e) => form.setFieldValue(field.name, e)}
                  />
                )}
              </Field>
            </AddressFieldset>
            <AddressFieldset>
              <label htmlFor="notes">{translateRaw('ADDRESSBOOK_NOTES')}</label>
              <Field name="notes">
                {({ field }: FieldProps<string>) => (
                  <InputField
                    {...field}
                    textarea={true}
                    placeholder={translateRaw('ADDRESSBOOK_NOTES_PLACEHOLDER')}
                  />
                )}
              </Field>
            </AddressFieldset>
            <AddressBookButtons>
              <Button type="button" secondary={true} onClick={toggleFlipped}>
                {translateRaw('CANCEL_ACTION')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {translateRaw('ADDRESS_BOOK_TABLE_ADD_ADDRESS')}
              </Button>
            </AddressBookButtons>
          </Form>
        )}
      </Formik>
    </AddToAddressBookPanel>
  );
}
