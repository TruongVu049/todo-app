import { useEffect, useRef } from 'react'

export function useFocus<T extends HTMLElement>(): [
  React.RefObject<T>,
  () => void,
] {
  const ref = useRef<T>(null)
  const setFocus = () => {
    ref.current?.focus()
  }
  useEffect(() => {}, [])

  return [ref, setFocus]
}
