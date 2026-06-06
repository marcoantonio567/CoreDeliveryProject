import { r as reactExports } from './react.mjs';

// packages/react/direction/src/direction.tsx
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

export { useDirection as u };
