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

export const WHITE_LIST = [
    'AX',
    'AL',
    'AD',
    'AO',
    'AI',
    'AG',
    'AM',
    'AR',
    'AW',
    'AT',
    'AU',
    'AZ',
    'BS',
    'BH',
    'BB',
    'BE',
    'BZ',
    'BJ',
    'BM',
    'BT',
    'BQ',
    'BW',
    'BR',
    'BN',
    'BG',
    'BF',
    'KH',
    'CA',
    'CV',
    'KY',
    'CX',
    'CK',
    'CC',
    'CO',
    'KM',
    'CR',
    'CL',
    'HR',
    'CY',
    'CW',
    'CZ',
    'DK',
    'DJ',
    'DM',
    'DO',
    'EC',
    'EE',
    'SV',
    'GQ',
    'SZ',
    'FK',
    'FO',
    'FM',
    'FJ',
    'FI',
    'FR',
    'GF',
    'GL',
    'DE',
    'GM',
    'GE',
    'GR',
    'GD',
    'GP',
    'GU',
    'GT',
    'GG',
    'GY',
    'HN',
    'HK',
    'HU',
    'IS',
    'IN',
    'ID',
    'IE',
    'IL',
    'IT',
    'JM',
    'JP',
    'JE',
    'JO',
    'KZ',
    'KE',
    'KI',
    'XK',
    'KW',
    'KG',
    'LV',
    'LA',
    'LT',
    'LU',
    'MO',
    'MQ',
    'YT',
    'MG',
    'MW',
    'MY',
    'MV',
    'MT',
    'MH',
    'MR',
    'MU',
    'MX',
    'MC',
    'MN',
    'MS',
    'MZ',
    'NA',
    'NR',
    'NZ',
    'NC',
    'NU',
    'NF',
    'MP',
    'NO',
    'OM',
    'PK',
    'PW',
    'PS',
    'PA',
    'PY',
    'PG',
    'PE',
    'PH',
    'PL',
    'PF',
    'PT',
    'PR',
    'RE',
    'RO',
    'RW',
    'BL',
    'MF',
    'SH',
    'PM',
    'SX',
    'KN',
    'LC',
    'VC',
    'WS',
    'SM',
    'ST',
    'SA',
    'SN',
    'SC',
    'SG',
    'SK',
    'SI',
    'SB',
    'KR',
    'ZA',
    'ES',
    'SR',
    'SE',
    'CH',
    'TJ',
    'TW',
    'TH',
    'TL',
    'NL',
    'TG',
    'TK',
    'TO',
    'TT',
    'TC',
    'TV',
    'TR',
    'UG',
    'AE',
    'GB',
    'TZ',
    'UY',
    'UZ',
    'VN',
    'VU',
    'VI',
    'WF',
    'ZM',
]
