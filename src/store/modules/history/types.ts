import Big from 'big.js'
import moment from 'moment'
import { Buffer } from '@c4tplatform/caminojs/dist'

export interface Chain {
    chainAlias: string
    chainID: string
}
export interface HistoryState {
    transactions: ITransactionData[]
    allTransactions: ITransactionData[]
    isUpdating: boolean
    isUpdatingAll: boolean
    chains: Chain[]
}

export interface RawTx {
    getBlockchainID: () => Buffer
}

export interface ITransactionData {
    multisigStatus?: number
    rawTx?: RawTx
    chainID: string
    id: string
    inputTotals: {
        [key: string]: string
    }
    inputs: TransactionInput[] | null
    memo: string
    outputTotals: {
        [key: string]: string
    }
    outputs: UTXO[]

    reusedAddressTotals: null
    rewarded: boolean
    rewardedTime: string
    timestamp: string
    txFee: number
    type: TransactionType
    validatorStart: number
    validatorEnd: number
    validatorNodeID: string
}

export interface ITransactionDataProcessed extends ITransactionData {
    isMonthChange: boolean
    isDayChange: boolean
}

interface TransactionInput {
    credentials: any[]
    output: UTXO
}

export interface UTXO {
    addresses: string[]
    amount: string
    assetID: string
    chainID: string
    groupID: number
    id: string
    locktime: number
    payload?: string
    outputIndex: number
    outputType: number
    redeemingTransactionID: string
    rewardUtxo: boolean
    stake?: boolean
    threshold: number
    timestamp: string
    transactionID: string
}

export type TransactionType =
    | 'base'
    | 'create_asset'
    | 'operation'
    | 'import'
    | 'export'
    | 'add_validator'
    | 'add_subnet_validator'
    | 'add_delegator'
    | 'create_chain'
    | 'create_subnet'
    | 'pvm_import'
    | 'pvm_export'
    | 'advance_time'
    | 'reward_validator'
    | 'deposit'
    | 'unlock_deposit'
    | 'register_node'
    | 'claim'

// CSV Staking Row
export type CsvRowStakingTxType = 'add_validator' | 'add_delegator' | 'fee_received'
export interface CsvRowStakingData {
    txId: string
    txType: CsvRowStakingTxType
    stakeDate: moment.Moment
    stakeDuration: moment.Duration
    stakeAmount: Big
    rewardDate: moment.Moment
    isInputOwner: boolean
    isRewardOwner: boolean
    rewardAmtAvax: Big
    rewardAmtUsd?: Big
    avaxPrice?: number
    nodeID: string
}

// CSV Native Transaction Row
export interface CsvRowAvaxTransferData {
    txId: string
    date: Date
    from?: string[]
    to?: string[]
    amount: Big
    memo?: string
    isGain: boolean
}

// Output Types defined in magellan (different to camino-node)
const RegisterOutputTypeCustom = 8192

export const OutputTypesLockedOutD = RegisterOutputTypeCustom + 0
export const OutputTypesLockedOutB = RegisterOutputTypeCustom + 1
export const OutputTypesLockedOutDB = RegisterOutputTypeCustom + 2

export const IsOutputDeposited = (ot: number) =>
    ot === OutputTypesLockedOutD || ot === OutputTypesLockedOutDB
export const IsBonded = (ot: number) =>
    ot === OutputTypesLockedOutB || ot === OutputTypesLockedOutDB
