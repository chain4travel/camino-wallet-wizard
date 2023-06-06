import {
    KeyChain as AVMKeyChain,
    KeyPair as AVMKeyPair,
    UTXOSet as AVMUTXOSet,
} from '@c4tplatform/caminojs/dist/apis/avm'

import { UTXOSet as PlatformUTXOSet } from '@c4tplatform/caminojs/dist/apis/platformvm'
import { ava, bintools } from '@/AVA'
import HDKey from 'hdkey'
import { Buffer } from '@c4tplatform/caminojs/dist'
import {
    KeyChain as PlatformVMKeyChain,
    KeyPair as PlatformVMKeyPair,
} from '@c4tplatform/caminojs/dist/apis/platformvm'
import store from '@/store'

import { getAddressChains } from '@/explorer_api'
import { AvaNetwork } from '@/js/AvaNetwork'
import { ChainAlias } from './wallets/types'
import { avmGetAllUTXOs, platformGetAllUTXOs } from '@/helpers/utxo_helper'
import { updateFilterAddresses } from '@/providers'

const INDEX_RANGE: number = 20 // a gap of at least 20 indexes is needed to claim an index unused

const SCAN_SIZE: number = 100 // the total number of utxos to look at initially to calculate last index
const SCAN_RANGE: number = SCAN_SIZE - INDEX_RANGE // How many items are actually scanned
class HdHelper {
    chainId: ChainAlias
    keyChain: AVMKeyChain | PlatformVMKeyChain
    keyCache: {
        [index: number]: AVMKeyPair | PlatformVMKeyPair
    }
    addressCache: {
        [index: number]: string
    }
    hdCache: {
        [index: number]: HDKey
    }
    changePath: string
    masterKey: HDKey
    ethKeyPair: AVMKeyPair | PlatformVMKeyPair | undefined
    hdIndex: number
    utxoSet: AVMUTXOSet | PlatformUTXOSet
    isPublic: boolean
    isFetchUtxo: boolean // true if updating balance
    isInit: boolean // true if HD index is found

    constructor(
        changePath: string,
        masterKey: HDKey,
        ethKey?: HDKey,
        chainId: ChainAlias = 'X',
        isPublic: boolean = false
    ) {
        this.changePath = changePath
        this.isFetchUtxo = false
        this.isInit = false

        this.chainId = chainId
        let hrp = ava.getHRP()
        if (chainId === 'X') {
            this.keyChain = new AVMKeyChain(hrp, chainId)
            this.utxoSet = new AVMUTXOSet()
        } else {
            this.keyChain = new PlatformVMKeyChain(hrp, chainId)
            this.utxoSet = new PlatformUTXOSet()
        }

        this.keyCache = {}
        this.addressCache = {}
        this.hdCache = {}
        this.masterKey = masterKey
        this.hdIndex = 0
        this.isPublic = isPublic
        this.ethKeyPair = undefined

        if (ethKey) {
            this.ethKeyPair = this.keyChain.importKey(Buffer.from(ethKey.privateKey))
        }
    }

    // When the wallet connects to a different network
    // Clear internal data and scan again
    onNetworkChange() {
        this.clearCache()
        this.isInit = false
        let hrp = ava.getHRP()
        if (this.chainId === 'X') {
            this.keyChain = new AVMKeyChain(hrp, this.chainId)
            this.utxoSet = new AVMUTXOSet()
        } else {
            this.keyChain = new PlatformVMKeyChain(hrp, this.chainId)
            this.utxoSet = new PlatformUTXOSet()
        }
        this.hdIndex = 0
        this.addressCache = {}
        this.keyCache = {}
    }

    // Increments the hd index by one and adds the key
    // returns the new keypair
    incrementIndex(): number {
        let newIndex: number = this.hdIndex + 1

        if (!this.isPublic) {
            if (this.chainId === 'X') {
                let keychain = this.keyChain as AVMKeyChain
                let newKey = this.getKeyForIndex(newIndex) as AVMKeyPair
                keychain.addKey(newKey)
            } else {
                let keychain = this.keyChain as PlatformVMKeyChain
                let newKey = this.getKeyForIndex(newIndex) as PlatformVMKeyPair
                keychain.addKey(newKey)
            }
        }

        this.hdIndex = newIndex

        // Update websocket addresses with the new one
        updateFilterAddresses()

        return newIndex
    }

    async findHdIndex() {
        // Check if explorer is available

        // @ts-ignore
        let network: AvaNetwork = store.state.Network.selectedNetwork
        let explorerUrl = network.explorerUrl

        if (explorerUrl) {
            try {
                this.hdIndex = await this.findAvailableIndexExplorer()
            } catch (e) {
                console.log('Explorer exception -> Fallback')
                this.hdIndex = await this.findAvailableIndexNode()
            }
        } else {
            this.hdIndex = await this.findAvailableIndexNode()
        }

        if (!this.isPublic) {
            this.updateKeychain()
        }
        this.isInit = true
    }

    startUTXOFetch(): void {
        this.isFetchUtxo = true
    }

    // Fetches the utxos for the current keychain
    // and increments the index if last index has a utxo
    async updateUtxos(): Promise<AVMUTXOSet | PlatformUTXOSet> {
        if (!this.isInit) {
            console.error('HD Index not found yet.')
        }

        let addrs: string[] = this.getAllAddresses()
        let result: AVMUTXOSet | PlatformUTXOSet

        if (this.chainId === 'X') {
            result = await avmGetAllUTXOs(addrs)
        } else {
            result = await platformGetAllUTXOs(addrs)
        }
        this.utxoSet = result // we can use local copy of utxos as cache for some functions

        // If the hd index is full, increment
        let currentAddr = this.getCurrentAddress()
        let currentAddrBuf = bintools.parseAddress(currentAddr, this.chainId)
        let currentUtxos = result.getUTXOIDs([currentAddrBuf])

        if (currentUtxos.length > 0) {
            this.incrementIndex()
        }
        this.isFetchUtxo = false
        return result
    }

    // Returns more addresses than the current index
    getExtendedAddresses() {
        let hdIndex = this.hdIndex
        return this.getAllDerivedAddresses(hdIndex + INDEX_RANGE)
    }

    // Not used?
    getUtxos(): AVMUTXOSet | PlatformUTXOSet {
        return this.utxoSet
    }

    // Updates the helper keychain to contain keys upto the HD Index
    updateKeychain(): AVMKeyChain | PlatformVMKeyChain {
        let hrp = ava.getHRP()
        let keychain: AVMKeyChain | PlatformVMKeyChain

        if (this.chainId === 'X') {
            keychain = new AVMKeyChain(hrp, this.chainId)
        } else {
            keychain = new PlatformVMKeyChain(hrp, this.chainId)
        }
        if (this.ethKeyPair) keychain.addKey(this.ethKeyPair)

        for (let i: number = 0; i <= this.hdIndex; i++) {
            let key: AVMKeyPair | PlatformVMKeyPair
            if (this.chainId === 'X') {
                key = this.getKeyForIndex(i) as AVMKeyPair
                ;(keychain as AVMKeyChain).addKey(key)
            } else {
                key = this.getKeyForIndex(i) as PlatformVMKeyPair
                ;(keychain as PlatformVMKeyChain).addKey(key)
            }
        }
        this.keyChain = keychain
        return keychain
    }

    getKeychain() {
        return this.keyChain
    }

    // Returns all key pairs up to hd index
    getAllKeys(upTo = this.hdIndex): AVMKeyPair[] | PlatformVMKeyPair[] {
        let set: AVMKeyPair[] | PlatformVMKeyPair[] = this.ethKeyPair ? [this.ethKeyPair] : []
        for (var i = 0; i <= upTo; i++) {
            if (this.chainId === 'X') {
                let key = this.getKeyForIndex(i) as AVMKeyPair
                ;(set as AVMKeyPair[]).push(key)
            } else {
                let key = this.getKeyForIndex(i) as PlatformVMKeyPair
                ;(set as PlatformVMKeyPair[]).push(key)
            }
        }
        return set
    }

    getStaticAddress(): string {
        return this.ethKeyPair
            ? bintools.addressToString(ava.getHRP(), this.chainId, this.ethKeyPair.getAddress())
            : ''
    }

    getAllDerivedAddresses(upTo = this.hdIndex, start = 0): string[] {
        const res = []
        for (var i = start; i <= upTo; i++) {
            let addr = this.getAddressForIndex(i)
            res.push(addr)
        }
        return res
    }

    getAllAddresses(upTo = this.hdIndex, start = 0): string[] {
        const res = this.getAllDerivedAddresses(upTo, start)
        if (start === 0 && this.ethKeyPair) res.unshift(this.getStaticAddress())
        return res
    }

    clearCache() {
        this.keyCache = {}
        this.addressCache = {}
    }

    // Scans the address space of this hd path and finds the last used index using the
    // explorer API.
    async findAvailableIndexExplorer(startIndex = 0): Promise<number> {
        let upTo = SCAN_SIZE

        let addrs = this.getAllDerivedAddresses(startIndex + upTo, startIndex)
        let addrChains = await getAddressChains(addrs)

        let chainID
        if (this.chainId === 'X') {
            chainID = ava.XChain().getBlockchainID()
        } else {
            chainID = ava.PChain().getBlockchainID()
        }

        let gapSize = 0,
            i = 0
        for (; i < addrs.length && gapSize < INDEX_RANGE; i++) {
            let rawAddr = addrs[i].split('-')[1]
            let chains: string[] = addrChains[rawAddr]
            if (!chains || !chains.includes(chainID)) {
                gapSize++
            } else {
                gapSize = 0
                // No chance to find gap in this chunk
                if (addrs.length - i < INDEX_RANGE) break
            }
        }
        // If the gap is reached return the index
        if (gapSize === INDEX_RANGE) {
            return i - INDEX_RANGE
        }

        return await this.findAvailableIndexExplorer(startIndex + (upTo - INDEX_RANGE))
    }

    // Uses the node to find last used HD index
    // Only used when there is no explorer API available
    async findAvailableIndexNode(start: number = 0): Promise<number> {
        let addrs: string[] = []

        // Get keys for indexes start to start+scan_size
        for (let i: number = start; i < start + SCAN_SIZE; i++) {
            let address = this.getAddressForIndex(i)
            addrs.push(address)
        }

        let utxoSet

        if (this.chainId === 'X') {
            utxoSet = (await ava.XChain().getUTXOs(addrs)).utxos
        } else {
            utxoSet = (await ava.PChain().getUTXOs(addrs)).utxos
        }

        // Scan UTXOs of these indexes and try to find a gap of INDEX_RANGE
        let gapSize = 0,
            i = 0
        for (; i < addrs.length && gapSize < INDEX_RANGE; i++) {
            let addrBuf = bintools.parseAddress(addrs[i], this.chainId)
            let addrUTXOs: string[] = utxoSet.getUTXOIDs([addrBuf])
            if (addrUTXOs.length === 0) {
                gapSize++
            } else {
                gapSize = 0
                // No chance to find gap in this chunk
                if (addrs.length - i < INDEX_RANGE) break
            }
        }

        // If we found a gap of 20, we can return the last fullIndex+1
        if (gapSize === INDEX_RANGE) {
            return i - INDEX_RANGE
        }

        return await this.findAvailableIndexNode(start + SCAN_RANGE)
    }

    getFirstAvailableIndex(): number {
        for (var i = 0; i < this.hdIndex; i++) {
            let addr = this.getAddressForIndex(i)
            let addrBuf = bintools.parseAddress(addr, this.chainId)
            let utxoIds = this.utxoSet.getUTXOIDs([addrBuf])
            if (utxoIds.length === 0) {
                return i
            }
        }

        return 0
    }

    // Returns the key of the first index that has no utxos
    getFirstAvailableAddress(): string {
        const idx = this.getFirstAvailableIndex()
        return this.getAddressForIndex(idx)
    }

    getCurrentKey(): AVMKeyPair | PlatformVMKeyPair {
        let index: number = this.hdIndex
        return this.getKeyForIndex(index)
    }

    getCurrentAddress(): string {
        let index = this.hdIndex
        return this.getAddressForIndex(index)
    }

    // TODO: Public wallet should never be using this
    getKeyForIndex(index: number, isPrivate: boolean = true): AVMKeyPair | PlatformVMKeyPair {
        // If key is cached return that
        let cacheExternal: AVMKeyPair | PlatformVMKeyPair

        if (this.chainId === 'X') {
            cacheExternal = this.keyCache[index] as AVMKeyPair
        } else {
            cacheExternal = this.keyCache[index] as PlatformVMKeyPair
        }

        if (cacheExternal) return cacheExternal

        let derivationPath: string = `${this.changePath}/${index.toString()}`

        // Get key from cache, if not generate it
        let key: HDKey
        if (this.hdCache[index]) {
            key = this.hdCache[index]
        } else {
            key = this.masterKey.derive(derivationPath) as HDKey
            this.hdCache[index] = key
        }

        let pkHex: string
        if (!this.isPublic) {
            pkHex = key.privateKey.toString('hex')
        } else {
            pkHex = key.publicKey.toString('hex')
        }

        let pkBuf: Buffer = new Buffer(pkHex, 'hex')
        let keypair = this.keyChain.importKey(pkBuf)

        // save to cache
        this.keyCache[index] = keypair
        return keypair
    }

    getAddressForIndex(index: number): string {
        if (this.addressCache[index]) {
            return this.addressCache[index]
        }

        let derivationPath: string = `${this.changePath}/${index.toString()}`
        // let key: HDKey = this.masterKey.derive(derivationPath) as HDKey;

        // Get key from cache, if not generate it
        let key: HDKey
        if (this.hdCache[index]) {
            key = this.hdCache[index]
        } else {
            key = this.masterKey.derive(derivationPath) as HDKey
            this.hdCache[index] = key
        }

        let pkHex = key.publicKey.toString('hex')
        let pkBuff = Buffer.from(pkHex, 'hex')
        let hrp = ava.getHRP()

        let chainId = this.chainId

        // No need for PlatformKeypair because addressToString uses chainID to decode
        let keypair = new AVMKeyPair(hrp, chainId)
        let addrBuf = AVMKeyPair.addressFromPublicKey(pkBuff)
        let addr = bintools.addressToString(hrp, chainId, addrBuf)

        this.addressCache[index] = addr
        return addr
    }

    // Given an address find the derived index
    findAddressIndex(addr: string): number | null {
        let addrs = this.getAllDerivedAddresses()
        let index = addrs.indexOf(addr)

        if (index < 0) return null
        return index
    }
}
export { HdHelper }
