// ----------------------------------------------------------------------
import * as Yup from 'yup';

interface JsonObjectType {
  type?: string;
  required: string[];
  properties: {
    [key: string]: {
      [key: string]: string;
    };
  };
  additionalProperties?: boolean;
}

// Needed to format keys with dots, as RHF doesn't accept these
const formatJsonKeys = (json: JsonObjectType) => ({
  ...json,
  required: json.required.map((prop) => prop.replaceAll('.', '_')),
  properties: Object.fromEntries(
    Object.entries(json.properties).map(([key, value]) => {
      const formattedKey = key.replaceAll('.', '_');
      return [formattedKey, value];
    })
  ),
});

export const generateSchema = (json: JsonObjectType) => {
  const formattedJson = formatJsonKeys(json);
  const yupObject: Yup.ObjectShape = {};
  Object.entries(formattedJson.properties).forEach(([key, value]) => {
    console.log(value.type);

    let yupKeyEntry;
    if (value.type === 'integer') {
      yupKeyEntry = Yup.number().integer().typeError('This must be a integer');
    } else {
      yupKeyEntry = Yup.number().typeError('This must be a number');
    }

    if (Object.values(formattedJson.required).includes(key)) {
      yupKeyEntry = yupKeyEntry.required(`${key.replaceAll('_', '.')} is required`);
    }
    yupObject[key] = yupKeyEntry;
  });
  return Yup.object().shape(yupObject);
};
// export const FormSchema = (json: JsonObjectType) => generateSchema(formatJsonKeys(json));
