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

export enum AddressState {
    ROLE_ADMIN = 0,
    ROLE_KYC = 1,
    ROLE_OFFERS_ADMIN = 2,
    KYC_VERIFIED = 32,
    KYC_EXPIRED = 33,
    CONSORTIUM = 38,
    NODE_DEFERRED = 39,
    OFFERS_CREATOR = 50,
}
