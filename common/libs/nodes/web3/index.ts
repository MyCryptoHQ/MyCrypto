import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei, TokenValue } from 'libs/units';
import { INode, TxObj } from '../INode';
import ERC20 from 'libs/erc20';

export default class Web3Node implements INode {
  private web3: any;

  constructor(web3: any) {
    this.web3 = web3;
  }

  public sendCallRequest(txObj: TxObj): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.eth.call(txObj, 'pending', (err, res) => {
        if (err) {
          return reject(err.message);
        }
        // web3 return string
        resolve(res);
      });
    });
  }

  public getBalance(address: string): Promise<Wei> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(address, (err, res) => {
        if (err) {
          return reject(err);
        }
        // web3 returns BigNumber
        resolve(Wei(res.toString()));
      });
    });
  }

  public estimateGas(transaction: TransactionWithoutGas): Promise<Wei> {
    return new Promise((resolve, reject) =>
      this.web3.eth.estimateGas(
        {
          to: transaction.to,
          data: transaction.data
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          // web3 returns number
          resolve(Wei(res));
        }
      )
    );
  }

  public getTokenBalance(address: string, token: Token): Promise<TokenValue> {
    return new Promise(resolve => {
      this.web3.eth.call(
        {
          to: token.address,
          data: ERC20.balanceOf(address)
        },
        'pending',
        (err, res) => {
          if (err) {
            // TODO - Error handling
            return resolve(TokenValue('0'));
          }
          // web3 returns string
          resolve(TokenValue(res));
        }
      );
    });
  }

  public getTokenBalances(
    address: string,
    tokens: Token[]
  ): Promise<TokenValue[]> {
    return new Promise(resolve => {
      const batch = this.web3.createBatch();
      const totalCount = tokens.length;
      const returnArr = new Array<TokenValue>(totalCount);
      let finishCount = 0;

      tokens.forEach((token, index) =>
        batch.add(
          this.web3.eth.call.request(
            {
              to: token.address,
              data: ERC20.balanceOf(address)
            },
            'pending',
            (err, res) => finish(index, err, res)
          )
        )
      );
      batch.execute();

      function finish(index, err, res) {
        if (err) {
          // TODO - Error handling
          returnArr[index] = TokenValue('0');
        } else {
          // web3 returns string
          returnArr[index] = TokenValue(res);
        }

        finishCount++;
        if (finishCount === totalCount) {
          resolve(returnArr);
        }
      }
    });
  }

  public getTransactionCount(address: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this.web3.eth.getTransactionCount(address, 'pending', (err, txCount) => {
        if (err) {
          return reject(err);
        }
        // web3 returns number
        resolve(txCount.toString());
      })
    );
  }

  public getCurrentBlock(): Promise<string> {
    return new Promise((resolve, reject) =>
      this.web3.eth.getBlock('latest', false, (err, block) => {
        if (err) {
          return reject(err);
        }
        resolve(block.number);
      })
    );
  }

  public sendRawTx(signedTx: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this.web3.eth.sendRawTransaction(signedTx, (err, txHash) => {
        if (err) {
          return reject(err);
        }
        // web3 return string
        resolve(txHash);
      })
    );
  }
}
