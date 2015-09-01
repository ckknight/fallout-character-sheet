import Character from './Character';

const safeJSONParse = str => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
};

const convert = data => {
  return new Character(data);
};

export default function deserialize(localStorageValue$) {
  return localStorageValue$
    .map(safeJSONParse)
    .map(convert);
}
;
