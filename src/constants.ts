import { BN } from '@c4tplatform/caminojs/dist'

export const MINUTE_MS = 60000
export const HOUR_MS = MINUTE_MS * 60
export const DAY_MS = HOUR_MS * 24
export type ChainIdType = 'X' | 'P' | 'C'
export const ZeroBN = new BN(0)
export enum KYC_VARIANT {
    KYC_BASIC = 'kyc_basic',
    KYB_BASIC = 'kyb_basic',
}
