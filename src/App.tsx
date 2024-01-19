import { QueryClient } from '@tanstack/react-query' // Import the correct QueryClient type
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { Config, WagmiConfig } from 'wagmi'
import { mainnet } from 'viem/chains'
import Main from './components/Main'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '3416a7ddd12e0a34d7eca133aeafc849'

// 2. Create wagmiConfig
const metadata = {
  name: 'PAALX Bots',
  description: 'Connect to PAALX Bots to mint your NFTs.',
  url: 'https://paalai.io/',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({
  wagmiConfig, projectId, chains, themeVariables: {
    '--w3m-accent': '#9462E1',
    '--w3m-border-radius-master': '0.0375rem',
  }
})

{/** WagmiConfig has a complex typo fix to make it work... */}
export default function App() {
  return (    
    <WagmiConfig config={wagmiConfig as unknown as Config<any, any> & { queryClient: QueryClient }}>
      <Main></Main>
    </WagmiConfig>
  )
}