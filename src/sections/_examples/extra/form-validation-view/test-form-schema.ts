// ----------------------------------------------------------------------
import * as Yup from 'yup';
import { RJSFSchema } from '@rjsf/utils';

// Needed to format keys with dots, as RHF doesn't accept these

export const generateSchema = (json: RJSFSchema) => {
  const yupObject: Yup.ObjectShape = {};
  Object.entries(json.properties).forEach(([key, value]) => {
    console.log(value.type);

    let yupKeyEntry;
    if (value.type === 'integer') {
      yupKeyEntry = Yup.number().integer().typeError('This must be a integer');
    } else {
      yupKeyEntry = Yup.number().typeError('This must be a number');
    }

    if (Object.values(json.required).includes(key)) {
      yupKeyEntry = yupKeyEntry.required(`${key.replaceAll('_', '.')} is required`);
    }
    yupObject[key] = yupKeyEntry;
  });
  return Yup.object().shape(yupObject);
};
// export const FormSchema = (json: JsonObjectType) => generateSchema(formatJsonKeys(json));
