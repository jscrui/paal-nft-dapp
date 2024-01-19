import { useCallback, useEffect, useState } from 'react';
import { Dialog, Disclosure } from '@headlessui/react'
import { Bars3Icon, CheckCircleIcon, MinusSmallIcon, PlusSmallIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/20/solid'

//Import media
import Background from '../media/images/paal-ai-background.png';
import BackgroundSection from '../media/images/paal-ai-background-section.png';
import NftExample from '../media/images/paal-ai-nft-example.png';

//Import Media Icons
import Twitter from '../media/images/icons/1-twitter.png';
import Telegram from '../media/images/icons/2-telegram.png';
import Discord from '../media/images/icons/3-discord.png';
import Dextools from '../media/images/icons/4-dextools.png';
import Gecko from '../media/images/icons/5-gecko.png';
import Bit from '../media/images/icons/6-bit.png';
import Gateio from '../media/images/icons/7-gateio.png';

//Import Media Brands
import OkxLogo from '../media/images/brands/okx-logo.png';
import CoingeckoLogo from '../media/images/brands/coingecko-logo.png';

import GeckoTerminalLogo from '../media/images/brands/geckoterminal-logo.png';

//Web3
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from "wagmi";
import { readContract } from "@wagmi/core"
import { PAALXBotsCollectionABI } from '../abi/PAALXBotsCollection-abi'
const PAALXBotsAddress = import.meta.env.VITE_NFT_COLLECTION_ADDRESS;
import { parseEther } from 'viem'

//Import Component
import NotificationSuccess from './NotificationSuccess'
import NotificationError from './NotificationError'


export default function Main() {
    const { isConnected, address } = useAccount();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [amountToMint, setAmountToMint] = useState(1)
    const [tokensHoldByAddress, setTokensHoldByAddress] = useState<number[]>([]);

    console.log("isConnected with:", address)

    //Fetch and Display NFTs Functions
    const {
        data: balanceOfAddress,
        error: errorNFTs,
        isLoading: isLoadingNFTs,
        isError: isErrorNFTs,
    } = useContractRead({
        abi: PAALXBotsCollectionABI,
        address: PAALXBotsAddress,
        functionName: 'balanceOf',
        args: [address],
    });

    const balanceOf = Number(balanceOfAddress);

    const fetchTokenURI = async () => {

        let internalArrayOfTokens: number[] = [];

        for (let i = 1; i < 1000; i++) {

            //Check if owner is the same as the logged in address
            readContract({
                abi: PAALXBotsCollectionABI,
                address: PAALXBotsAddress,
                functionName: 'ownerOf',
                args: [i],
            }).then((ownerOf) => {
                ownerOf === address ? (
                    internalArrayOfTokens.push(i)
                ) : null

            }).catch(() => {
                let i = 1001;
            })

        }

        setTokensHoldByAddress(internalArrayOfTokens);

    };


    //Minting Functions
    const {
        config: configMintSingle,
        error: errorPreparingMintSingle,
        isError: isErrorPreparingMintSingle
    } = usePrepareContractWrite({
        address: PAALXBotsAddress, // default empty address
        abi: PAALXBotsCollectionABI,
        functionName: 'mintBatch',
        args: [amountToMint],
        value: parseEther((0.001 * amountToMint).toString()),
    });

    const {
        data: dataMintSingle,
        error: errorMintSingle,
        isError: isErrorMintSingle,
        write: writeMintSingle
    } = useContractWrite(configMintSingle);


    const {
        isLoading: isLoadingMintSingle,
        isSuccess: isSuccessMintSingle,
    } = useWaitForTransaction({
        hash: dataMintSingle?.hash,
    });


    //call fetchTokenURI function only once or if the address changes
    useEffect(() => {
        fetchTokenURI();
    }, [address]);

    return (
        <div className="bg-white">

            <main className='bg-black'>
                {/* Header */}
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <a href="#" className="-m-1.5 p-1.5">
                                <img className="h-14 w-auto" src="https://paalai.io/assets/paal-ai-logo-cb568b71.png" alt="" />
                            </a>
                        </div>

                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="hidden lg:flex lg:gap-x-12">
                            {/* {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white">
                                {item.name}
                            </a>
                        ))} */}
                        </div>

                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <w3m-button />
                        </div>
                    </nav>
                    <Dialog as="div" className="lg:hidde" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                        <div className="fixed inset-0 z-50" />

                        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-zinc-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <img className="h-14 w-auto" src="https://paalai.io/assets/paal-ai-logo-cb568b71.png" alt="" />
                                </a>
                                <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flex-1 justify-center flex">
                                <w3m-button />
                            </div>
                        </Dialog.Panel>

                    </Dialog>
                </header>

                {/* Hero section */}
                <div className="relative isolate overflow-hidden bg-gray-900 pb-16 pt-14 sm:pb-20 z-20">

                    <img src={Background} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover backdrop-brightness-0" />

                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">

                            <div className="text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-custom-purple sm:text-6xl">
                                    Mint. Wait. Reveal.
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-300 font-bold">
                                    PAAL Xclusive NFT Mint Event:
                                </p>
                                <p className="text-lg leading-8 text-gray-300">
                                    Access Fee-Free Trading on PaalX v1.1
                                </p>
                                <p className="text-lg leading-8 text-gray-300">
                                    Earn passive ETH from NFT trading volume fees.
                                </p>
                                <p className="text-lg leading-8 text-gray-300">
                                    Access to exclusive features in PaalX.
                                </p>

                                <h2 className="text-4xl tracking-tight text-custom-purple sm:text-4xl mt-6">
                                    Minted 0 out of 1000 NFTs
                                </h2>

                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <a href="#how-to-section" className="rounded-md border border-purple-600 px-3.5 py-1.5 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:border-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                                        How it Works?
                                    </a>
                                    {
                                        !isConnected ? <w3m-button size='md' /> : (

                                            isErrorPreparingMintSingle ?
                                                (
                                                    <div className="cursor-not-allowed rounded-md border border-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:border-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                                                        Mint Closed
                                                    </div>
                                                ) : (
                                                    <div onClick={writeMintSingle} className={`${isLoadingMintSingle ? "cursor-pointer" : ""} rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 cursor-pointer`}>
                                                        Mint {amountToMint} NFT
                                                    </div>
                                                )
                                        )
                                    }

                                </div>

                                {
                                    !isConnected ? "" : (
                                        <>
                                            <div className="mt-10 flex items-center justify-center gap-x-6 text-white">
                                                Choose how many NFTs do you want to mint
                                            </div>
                                            <div className="mt-6 items-center justify-center gap-x-6 flex flex-col lg:flex-row">
                                                <div onClick={() => setAmountToMint(1)} className="justify-center w-26 w-1/3 my-1 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 inline-flex">
                                                    1 NFT
                                                    {amountToMint === 1 ? <CheckCircleIcon className="ml-3 h-5 w-5" aria-hidden="true" /> : ""}
                                                </div>
                                                <div onClick={() => setAmountToMint(5)} className="justify-center w-26 w-1/3 my-1 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 inline-flex">
                                                    5 NFT
                                                    {amountToMint === 5 ? <CheckCircleIcon className="ml-3 h-5 w-5" aria-hidden="true" /> : ""}
                                                </div>
                                                <div onClick={() => setAmountToMint(10)} className="justify-center w-26 w-1/3 my-1 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 inline-flex">
                                                    10 NFT
                                                    {amountToMint === 10 ? <CheckCircleIcon className="ml-3 h-5 w-5" aria-hidden="true" /> : ""}
                                                </div>
                                                <div onClick={() => setAmountToMint(15)} className="justify-center w-26 w-1/3 my-1 rounded-md bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 inline-flex">
                                                    15 NFT
                                                    {amountToMint === 15 ? <CheckCircleIcon className="ml-3 h-5 w-5" aria-hidden="true" /> : ""}
                                                </div>

                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        {/* Logo cloud */}
                        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://paalai.io/assets/Amino-c27fc2fa.png"
                                alt="Amino Awards"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src="https://paalai.io/assets/gcloud-4ce53006.png"
                                alt="Google Cloud"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                                src={OkxLogo}
                                alt="OKX Logo"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                                src={CoingeckoLogo}
                                alt="Coingecko Logo"
                                width={158}
                                height={48}
                            />
                            <img
                                className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                                src={GeckoTerminalLogo}
                                alt="Statamic"
                                width={158}
                                height={48}
                            />
                        </div>
                    </div>

                </div>


                {/* About PAALX section */}
                {/* <div className="relative isolate mt-32 bg-white px-6 sm:mt-56 lg:px-8"> */}
                <div className="relative isolate bg-white px-6 lg:px-8 pb-24" id='how-to-section'>
                    <img src={BackgroundSection} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover backdrop-brightness-0" />
                    <div
                        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
                        aria-hidden="true"
                    >
                        <div
                            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>


                    <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2> */}
                        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-xl mt-24">
                            Embrace the future of digital asset trading. Mint your PAAL Xclusive NFT <br></br> today for seamless, fee-free experiences on PaalX v1.1.
                        </p>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-500">
                        🌟 NFT Mint Launch: Dive into the exclusive PAAL Xclusive NFT Minting, now <br></br>  open! Secure your very own PAAL Xclusive Whitelist NFT for just 0.1 ETH.
                    </p>
                    <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-end gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3 gap-x-3">

                        <div className='border-custom-purple rounded-2xl text-center p-6 relative mb-16 lg:mb-0'>
                            {/** emoji that should be half inside and half outsie the card and over the top border*/}
                            <div className='text-8xl absolute inset-x-0 -top-8'>
                                🔑
                            </div>

                            {/** title */}
                            <div className='text-xl font-bold text-custom-purple mt-14'>
                                Exclusive Benefits
                            </div>

                            {/** description */}
                            <p className='text-gray-400 mx-3 mt-4'>
                                Each PAAL Xclusive NFT is not only a testament to your pioneering spirit but also a gateway to exceptional privileges. Enjoy zero trading fees on the innovative PaalX v0.1 platform as an NFT holder.
                            </p>
                        </div>
                        <div className='border-custom-purple rounded-2xl text-center p-6'>
                            {/** nft example image */}
                            <div>
                                <img src={NftExample} alt="NFT Example image" className='rounded-2xl' />
                            </div>

                            {/** title */}
                            <div className='text-2xl font-bold text-custom-purple mt-2'>
                                Mint your NFT(0.1 ETH)
                            </div>

                            <div className='text-md font-bold text-gray-200 mt-2 mx-4'>
                                There will be 1000 NFTs available for minting.
                            </div>

                            {/** description */}
                            <p className='text-gray-400 mx-3 mt-4'>
                                One mint per wallet. The NFT will be used to claim your relay in stage two.
                            </p>
                        </div>
                        <div className='border-custom-purple rounded-2xl text-center p-6 relative mt-16 lg:mt-0'>
                            {/** emoji that should be half inside and half outsie the card and over the top border*/}
                            <div className='text-8xl absolute inset-x-0 -top-10'>
                                🚀
                            </div>
                            {/** title */}
                            <div className='text-xl font-bold text-custom-purple mt-14'>
                                Enhanced Trading <br></br> Experience
                            </div>

                            {/** description */}
                            <p className='text-gray-400 mx-3 mt-4'>
                                Beyond the initial mint, your NFT transcends a digital collectible, unlocking advanced trading functionalities on PaalX.
                                <br />
                                <br />
                            </p>
                        </div>
                    </div>
                </div>

                {/** User Hold Collection */}
                <div className="isolate bg-black px-6 lg:px-8 pb-24 py-0">

                    <div
                        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
                        aria-hidden="true"
                    >
                        <div
                            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>


                    <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2> */}
                        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-xl mt-24">
                            Your collection of PAAL Xclusive NFTs
                        </p>
                    </div>

                    {/* 
                        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-400">
                            Sorry, actually you don't have any NFTs. <br></br> Buy yours now!
                        </p> 
                    */}
                    <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-end gap-y-6 sm:mt-6 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3 gap-x-3">

                        {
                            tokensHoldByAddress.map((tokenId, index) => (
                                <div className='border-custom-purple rounded-2xl text-center px-6 pt-6 pb-4 relative my-3 lg:mb-0' key={index}>
                                    <img src={'https://luxury-pudding-a5ff74.netlify.app/images/'+tokenId+'.png'} alt="" />
                                    <p className='text-gray-200 mt-8'>
                                        NFT #{tokenId}
                                    </p>
                                </div>
                            ))
                        }


                    </div>

                </div>

            </main>

            {/* Footer */}
            <footer className="flex justify-center flex-col items-center bg-black border-t py-12 border-purple-500" aria-labelledby="footer-heading">
                {/** Paal Logo */}
                <div className="flex justify-center items-center lg:mr-10">
                    <img className="h-14 w-auto" src="https://paalai.io/assets/paal-ai-logo-cb568b71.png" alt="" />
                </div>
                {/* Logo cloud */}
                <div className="mt-8 grid max-w-lg grid-cols-4 justify-items-center items-center gap-x-1 gap-y-10 sm:max-w-xl sm:grid-cols-6 lg:max-w-2xl lg:grid-cols-7">
                    <a href="https://twitter.com/PaalMind">
                        <img className="max-h-12 w-full object-contain" src={Twitter} alt="Twitter" />
                    </a>
                    <a href="https://t.me/paal_ai">
                        <img className="max-h-12 w-full object-contain" src={Telegram} alt="Telegram" />
                    </a>
                    <a href="https://discord.com/invite/paalai">
                        <img className="max-h-12 w-full object-contain" src={Discord} alt="Discord" />
                    </a>
                    <a href="https://www.dextools.io/app/en/ether/pair-explorer/0x2a6c340bcbb0a79d3deecd3bc5cbc2605ea9259f">
                        <img className="max-h-12 w-full object-contain" src={Dextools} alt="Dextools" />
                    </a>
                    <a href="https://www.geckoterminal.com/eth/pools/0x2a6c340bcbb0a79d3deecd3bc5cbc2605ea9259f">
                        <img className="max-h-12 w-full object-contain hidden sm:block" src={Gecko} alt="Gecko" />
                    </a>
                    <a href="https://www.bitmart.com/trade/en-US?symbol=PAAL_USDT">
                        <img className="max-h-12 w-full object-contain hidden sm:block" src={Bit} alt="Bit" />
                    </a>
                    <a href="https://www.gate.io/trade/PAAL_USDT">
                        <img className="max-h-12 w-full object-contain hidden sm:block" src={Gateio} alt="Google" />
                    </a>
                </div>
            </footer>


            {
                isSuccessMintSingle ? <NotificationSuccess /> : ""
            }

            {
                isErrorMintSingle ? <NotificationError /> : ""
            }


        </div>

    )
}