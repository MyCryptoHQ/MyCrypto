export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

interface IKeyedObj {
  [key: string]: any;
}
export const addProperties = (
  truthy,
  propertiesToAdd: IKeyedObj
): {} | IKeyedObj => (truthy ? propertiesToAdd : {});
