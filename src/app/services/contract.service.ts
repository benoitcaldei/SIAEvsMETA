import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import Web3 from 'web3';
const BN = require('bn.js');
import Wallet from 'ethereumjs-wallet';
import { toChecksumAddress } from 'web3-utils';
declare let window: any;

const contractABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'FundsReceived',
    type: 'event',
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAdvertisementFundValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCompanyFundValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMusicianValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPayPerListenValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPayPerViewValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getViews',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'increaseView',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'payToAddress',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_fund',
        type: 'address',
      },
    ],
    name: 'setCompanyFund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_fund',
        type: 'address',
      },
    ],
    name: 'setMarketingFund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_fund',
        type: 'address',
      },
    ],
    name: 'setMusicianFund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'setPayPerListenValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'setPayPerViewValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDeposited',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const contractAddress = '0x770532F9716a27f328cf2941FcB545cc1C24bF0c'; // Address of the deployed contract

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private contract: any;
  private web3: any;

  private marketingBudgetPrivateKey =
    '78361ae8fdc175ff002257e3c2c11919e98cf62652b2af08f50a52203e10537f';
  private marketingBudgetAddress = '0xCDBA714c9c5972422a758605Bc9ce3BfA286A59A';

  private companyBudgetPrivateKey =
    'e5f41b3d78d6bee24afbc601392ae05deecf6838a436230f7b798edb769b203a';
  private companyBudgetAddress = '0xA84fd6e2794256e93471A62d4C22198F01B6a211';

  private musicAuthorPrivateKey =
    '5254f59b2be5406ac4c616847a0e99e78f246a6ff8de7a2645c8df547c978ffa';
  private musicAuthorAddress = '0xAe9Df36b918c101dd6eB82e14Db5471822f39FcC';

  constructor(private snackBar: MatSnackBar) {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);

    this.addAccount(this.marketingBudgetPrivateKey);
    // this.addAccount(this.companyBudgetPrivateKey);
    // this.addAccount(this.musicAuthorPrivateKey);
    this.setBudgetFund();
    this.setCompanyFund();
    // this.addFunds();
  }

  public async addFunds() {
    // const accounts = await this.web3.eth.getAccounts();
    // console.log(accounts)
    // const gasPrice = await this.web3.eth.getGasPrice();
    // const nonce = await this.getCorrectNonce(accounts[0]);

    // const transactionObject = {
    //   from: accounts[0],
    //   to: contractAddress,
    //   value: this.web3.utils.toWei('0.0000000001', 'ether'),
    //   gasPrice: gasPrice,
    //   gas: undefined,
    //   nonce,
    // };
    // const estimatedGas = await this.web3.eth.estimateGas(transactionObject);
    // transactionObject.gas = estimatedGas + 100000; // Add some buffer to ensure enough gas;

    // Call the deposit() method
    // await this.contract.methods.deposit().send(transactionObject);
    const transaction = await this.contract.methods.deposit();
    return await this.signTransaction(
      transaction,
      this.web3.utils.toWei('0.0000000001', 'ether')
    );
    // this.web3.eth.sendTransaction(transactionObject, (error: any, result: any) => {
    //   if (error) {
    //     console.error('Error sending funds:', error);
    //   } else {
    //     console.log('Funds sent:', result);
    //   }
    // });
  }

  private async addAccount(key: string) {
    const wallet = Wallet.fromPrivateKey(Buffer.from(key, 'hex'));
    let account = this.web3.eth.accounts.privateKeyToAccount(`0x${key}`);
    await this.web3.eth.accounts.wallet.add(account);
  }

  private async signTransaction(
    transaction: {
      estimateGas: (arg0: { from: any }) => any;
      encodeABI: () => any;
    },
    value?: any
  ) {
    const accounts = await this.web3.eth.getAccounts();
    const gasPrice = await this.web3.eth.getGasPrice();
    const nonce = await this.getCorrectNonce(accounts[0]);
    console.log(gasPrice);
    let txParams = {};
    txParams = {
      ...txParams,
      from: accounts[0],
      to: contractAddress,
      data: transaction.encodeABI(),
      gasPrice: gasPrice + 5000,
      nonce,
    };

    if (value) {
      txParams = { ...txParams, value: value };
    }
    const estimatedGas = await this.web3.eth.estimateGas(txParams);
    console.log(estimatedGas);
    console.log('nonce', nonce);
    txParams = { ...txParams, gas: estimatedGas + 100000 }; // Add some buffer to ensure enough gas;
    try {
      // const txHash = await this.web3.eth.sendTransaction(txParams);
      const signedTx = await this.web3.eth.accounts.signTransaction(
        txParams,
        this.marketingBudgetPrivateKey
      );
      const receipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      return receipt;
    } catch (error) {
      console.log(error);

      this.snackBar.open(
        ('Transaction ERROR. ' +
          (error as { message: string }).message) as string,
        'Close',
        {
          panelClass: ['error-snackbar'],
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'end', // Horizontal position of the notification
          verticalPosition: 'bottom', // Vertical position of the notification
        }
      );
      console.error('Error occurred while sending transaction:', error);
    }
  }

  private async signTransactionToSendEther(
    transaction: {
      estimateGas: (arg0: { from: any }) => any;
      encodeABI: () => any;
    },
    fromAccount: any,
    value: any
  ) {
    const gasPrice = await this.web3.eth.getGasPrice();
    console.log('gasPrice', gasPrice);
    console.log('fromAccount', fromAccount);
    const nonce = await this.getCorrectNonce(fromAccount);
    console.log('nonce', nonce);

    const txParams = {
      from: toChecksumAddress(fromAccount),
      data: transaction.encodeABI(),
      value: value,
      gasPrice: gasPrice + 5000,
      gas: 500000,
      nonce,
    };

    const estimatedGas = await this.web3.eth.estimateGas(txParams);
    // console.log('estimatedGas', estimatedGas);

    txParams.gas = estimatedGas + 500000; // Add some buffer to ensure enough gas;
    try {
      // const txHash = await this.web3.eth.sendTransaction(txParams);
      const signedTx = await this.web3.eth.accounts.signTransaction(
        txParams,
        this.marketingBudgetPrivateKey
      );
      const txHash = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      this.snackBar.open(
        'Transaction successful. Transaction Hash:' + JSON.parse(txHash),
        'Close',
        {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'end', // Horizontal position of the notification
          verticalPosition: 'bottom', // Vertical position of the notification
        }
      );
      return txHash;
    } catch (error) {
      console.log(error);
      this.snackBar.open(
        ('Transaction ERROR. ' +
          (error as { message: string }).message) as string,
        'Close',
        {
          panelClass: ['error-snackbar'],
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'end', // Horizontal position of the notification
          verticalPosition: 'bottom', // Vertical position of the notification
        }
      );
      console.error('Error occurred while sending transaction:', error);
    }
  }

  private async setCompanyFund() {
    const companyFund = await this.contract.methods.getCompanyFundValue();
    if (companyFund) {
      return;
    }
    const transaction = await this.contract.methods.setCompanyFund(
      this.companyBudgetAddress
    );
    return this.signTransaction(transaction);
  }

  private async setBudgetFund() {
    const budgetFund = await this.contract.methods.getAdvertisementFundValue();
    if (budgetFund) {
      return;
    }
    const transaction = await this.contract.methods.setAdvertisementFund(
      this.marketingBudgetAddress
    );
    return this.signTransaction(transaction);
  }

  async savePayPerViewValue(payPerViewValue: number) {
    console.log(payPerViewValue);
    const transaction =
      this.contract.methods.setPayPerViewValue(payPerViewValue);
    return this.signTransaction(transaction);
  }

  async savePayPerListenValue(payPerViewValue: number) {
    const transaction =
      this.contract.methods.setPayPerListenValue(payPerViewValue);
    return this.signTransaction(transaction);
  }

  async getPayPerViewValue(): Promise<number> {
    const value = await this.contract.methods.getPayPerViewValue().call();
    return value;
  }

  async getCompanyBudget() {
    // const value = await this.contract.methods.getCompanyFundValue().call();
    const balance = await this.web3.eth.getBalance(contractAddress);
    console.log("the balance is ", balance)
    return balance;
  }

  async getMktBudget(): Promise<number> {
    const value = await this.contract.methods
      .getAdvertisementFundValue()
      .call();
    return value;
  }

  async getMusicianValue(): Promise<number> {
    const value = await this.contract.methods.getMusicianValue().call();
    return value;
  }

  async getPayPerListenValue(): Promise<number> {
    const value = await this.contract.methods.getPayPerListenValue().call();
    return value;
  }

  async increaseView() {
    const transaction = await this.contract.methods.increaseView();
    await this.signTransaction(transaction);
    return true;
  }

  async getViews(): Promise<number> {
    const value = await this.contract.methods.getViews().call();
    return value;
  }

  async deposit(): Promise<number> {
    const weiValue = await this.getPayPerViewValue();
    const value = this.web3.utils.fromWei(weiValue, 'ether');
    const transaction = await this.contract.methods.deposit();
    return await this.signTransaction(
      transaction,
      this.web3.utils.toWei(value + '', 'ether')
    );

    // const to = this.web3.utils.toChecksumAddress(this.companyBudgetAddress);
    // const from = this.web3.utils.toChecksumAddress(this.contract);
    // const value = await this.getPayPerViewValue();
    // const transaction = this.contract.methods.payToAddress(
    //   to,
    // );
    // console.log('transaction isFinite', transaction);
    // return await this.signTransactionToSendEther(transaction, from,  value);
  }

  async sendMusicMoneyToAuthor(): Promise<number> {
    const to = this.web3.utils.toChecksumAddress(this.musicAuthorAddress);
    const from = this.web3.utils.toChecksumAddress(contractAddress);
    const weiValue = await this.getPayPerListenValue();
    const value = this.web3.utils.fromWei(weiValue, 'ether');
    const transaction = this.contract.methods.payToAddress(to);
    return await this.signTransactionToSendEther(
      transaction,
      from,
      this.web3.utils.toWei(value + '', 'ether')
    );
  }
  index = 0;
  async getCorrectNonce(address: any): Promise<number> {
    this.index += 1;
    return (await this.web3.eth.getTransactionCount(address)) + this.index;
  }
}
