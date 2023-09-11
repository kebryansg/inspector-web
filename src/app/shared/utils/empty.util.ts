export function isEmpty(obj: any) {
  return Object.keys(obj).length === 0;
}


export const isNotEmpty = (value: any): boolean => {
  return value !== undefined && value !== null && value !== '';
};
