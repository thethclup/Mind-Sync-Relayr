import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { GameProvider } from './context/GameContext';
import MainScreen from './screens/MainScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <MainScreen />
        </GameProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
