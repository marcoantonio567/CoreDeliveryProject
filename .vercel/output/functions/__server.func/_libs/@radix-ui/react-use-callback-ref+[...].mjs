import { r as reactExports } from '../react.mjs';

// packages/react/use-callback-ref/src/use-callback-ref.tsx
function useCallbackRef(callback) {
  const callbackRef = reactExports.useRef(callback);
  reactExports.useEffect(() => {
    callbackRef.current = callback;
  });
  return reactExports.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

export { useCallbackRef as u };
