import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Screen = 'menu' | 'game' | 'codex' | 'leaderboard';

interface GameState {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  syncRate: number;
  setSyncRate: (rate: number | ((prev: number) => number)) => void;
  networksBuilt: number;
  setNetworksBuilt: (val: number | ((prev: number) => number)) => void;
  volume: number;
  setVolume: (val: number) => void;
}

const defaultState: GameState = {
  currentScreen: 'menu',
  setCurrentScreen: () => {},
  syncRate: 0,
  setSyncRate: () => {},
  networksBuilt: 0,
  setNetworksBuilt: () => {},
  volume: 0.5,
  setVolume: () => {},
};

const GameContext = createContext<GameState>(defaultState);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [syncRate, setSyncRate] = useState(0);
  const [networksBuilt, setNetworksBuilt] = useState(0);
  const [volume, setVolume] = useState(0.5);

  return (
    <GameContext.Provider value={{
      currentScreen, setCurrentScreen,
      syncRate, setSyncRate,
      networksBuilt, setNetworksBuilt,
      volume, setVolume
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
