import { GraphQLClient, gql } from 'graphql-request';

export interface UniswapTransaction {
  id: string;
}


export default async function getUniswapTransactions(hash: string): Promise<UniswapTransaction[] | null> {
  const url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

  const query = gql`
    query GetTransactions($hash: String!) {
      transactions(where: { id: $hash }) {
        id
      }
    }
  `;

  const variables = { hash };

  const client = new GraphQLClient(url);

  try {
    const data = await client.request<{ transactions: UniswapTransaction[] }>(query, variables);
    return data.transactions;
  } catch (error) {
    console.error('Errore nella richiesta GraphQL:', error);
    return null;
  }
}
