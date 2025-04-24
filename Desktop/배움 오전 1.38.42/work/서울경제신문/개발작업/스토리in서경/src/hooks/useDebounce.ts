import { useState, useEffect } from "react";

/**
 * 디바운스 커스텀 훅
 * @param value 디바운스할 값
 * @param delay 지연시간 (밀리세컨드)
 * @returns 디바운스된 값
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 지정된 지연시간 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 타이머 클리어 (cleanup 함수)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
