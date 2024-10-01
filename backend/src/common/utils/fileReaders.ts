import * as fs from 'fs';
import * as path from 'path';

export const getJson = (jsonType) => {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'dummyData',
    jsonType + '.json',
  );
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  try {
    const data = JSON.parse(jsonData);
    return data.length ? data : null;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};
