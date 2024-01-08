import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useForm } from 'react-hook-form';
import validator from '@rjsf/validator-ajv8';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';

import FormProvider from 'src/components/hook-form/form-provider';

import { generateSchema } from './test-form-schema';

const json: RJSFSchema = {
  type: 'object',
  required: [
    'Decision horizon',
    'Max price increase',
    'Max transaction value',
    'Max transaction volume',
    'Min transaction value',
    'Min transaction volume',
  ],
  properties: {
    'Decision horizon': {
      type: 'integer',
    },
    'Max price increase': {
      type: 'number',
    },
    'Max transaction value': {
      type: 'integer',
    },
    'Max transaction volume': {
      type: 'integer',
    },
    'Min transaction value': {
      type: 'integer',
    },
    'Min transaction volume': {
      type: 'integer',
    },
  },
  additionalProperties: false,
};

// Format json

const FormSchema = generateSchema(json);
// console.log('FormSchema', FormSchema);

// ----------------------------------------------------------------------

export const defaultValues: { [key: string]: string } = {};

Object.keys(json).forEach((key) => {
  defaultValues[key] = '';
});

type Props = {
  debug: boolean;
};
// const CustomTextWidget = (props) => {
//   console.log(props);
//   return <RHFTextField name="value" label="Full Name" />;
// };
// const customWidgets = {
//   TextWidget: CustomTextWidget,
// };

export default function TestForm({ debug }: Props) {
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });
  return (
    <Box
      gap={5}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
      }}
      border="1px solid black"
    >
      <FormProvider methods={methods}>
        <Form
          schema={json}
          validator={validator}
          formData={{
            'Decision horizon': 21,
            'Max price increase': 0.5,
            'Max transaction value': 20000000,
            'Max transaction volume': 20000,
            'Min transaction value': 30000,
            'Min transaction volume': 4000,
          }}
          // widgets={customWidgets}
          noHtml5Validate
        />
      </FormProvider>
    </Box>
  );
}

// ----------------------------------------------------------------------
