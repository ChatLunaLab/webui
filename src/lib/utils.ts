import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function* simpleNumberAnimation(
  start: number,
  end: number,
  duration: number
) {
  const startTime = performance.now()

  while (true) {
    const currentTime = performance.now()
    const elapsedTime = currentTime - startTime
    const progress = elapsedTime / duration

    if (progress >= 1) {
      yield end
      break
    }

    const currentValue = start + (end - start) * progress
    yield currentValue

    await new Promise((resolve) => setTimeout(resolve, 3))
  }
}
