// We use the response from the api which takes the form of
// {
//   ETH: {
//     USD: 173.42,
//     EUR: 152.43
//   }
// }
export type IRates = {
  [k in string]: Record<string, number>;
};
