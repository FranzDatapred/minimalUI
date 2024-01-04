import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import ValuesPreview from './values-preview';
import { generateSchema } from './test-form-schema';

const json = {
  type: 'object',
  required: [
    'Decision horizon',
    'Max. price increase',
    'Max. transaction value',
    'Max. transaction volume',
    'Min. transaction value',
    'Min. transaction volume',
  ],
  properties: {
    'Decision horizon': {
      type: 'integer',
    },
    'Max. price increase': {
      type: 'number',
    },
    'Max. transaction value': {
      type: 'integer',
    },
    'Max. transaction volume': {
      type: 'integer',
    },
    'Min. transaction value': {
      type: 'integer',
    },
    'Min. transaction volume': {
      type: 'integer',
    },
  },
  additionalProperties: false,
};

// Format json

const FormSchema = generateSchema(json);
console.log('FormSchema', FormSchema);

// ----------------------------------------------------------------------

export const defaultValues: { [key: string]: string } = {};

Object.keys(json).forEach((key) => {
  defaultValues[key] = '';
});

type Props = {
  debug: boolean;
};

export default function TestForm({ debug }: Props) {
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      {isSubmitting && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          gap={5}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          border="1px solid black"
        >
          <Stack spacing={2}>
            {Object.entries(FormSchema.fields).map(([key, value], index) => {
              console.log('key', key);
              const formattedLabel = key.replaceAll('_', '.');
              return (
                <Block key={`${index} input`}>
                  <RHFTextField name={key} label={formattedLabel} />
                </Block>
              );
            })}
          </Stack>
        </Box>
        <LoadingButton
          fullWidth
          color="info"
          size="large"
          type="submit"
          variant="soft"
          loading={isSubmitting}
        >
          Submit to Check
        </LoadingButton>
        {debug && <ValuesPreview />}
      </FormProvider>
    </>
  );
}

// ----------------------------------------------------------------------

interface BlockProps extends StackProps {
  label?: string;
  children: React.ReactNode;
}

function Block({ label = 'RHFTextField', sx, children }: BlockProps) {
  return (
    <Stack spacing={1} sx={{ width: 1, ...sx }}>
      <Typography
        variant="caption"
        sx={{
          textAlign: 'right',
          fontStyle: 'italic',
          color: 'text.disabled',
        }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
}
