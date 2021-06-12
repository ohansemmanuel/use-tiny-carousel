import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * TODO - Handle edge case: if user enters an out of range value. Lesser than 0 and higher than total number of carousel items
 */
function sanitizeIndex(val: number) {
  return val;
}

/**
 * @param direction - step forward or backward?
 * @param maxValue - the upper limit while stepping
 * @param step - steps occur in ones. +1 and -1. add multiplier e.g. x2, x3, x4 ...
 * @returns Ranged value.  never less than zero or more than the max value
 * */
const stepper = ({
  direction,
  value,
  maxValue,
  step = 1,
}: {
  direction: 'forward' | 'backward';
  value: number;
  maxValue: number;
  step?: number;
}) => {
  const directionOperationMap = {
    forward: 1,
    backward: -1,
  };

  const proposedStep = value + directionOperationMap[direction] * step;

  /** Negative? return the maximum value. */
  if (Math.sign(proposedStep) === -1) {
    return maxValue;
  }
  /** Ranged. Don't exceed the maximum value */
  if (proposedStep > maxValue) {
    return 0;
  }

  return proposedStep;
};

type Params = {
  numberOfItems: number;
  autoSetActive?: boolean;
  waitTime?: number;
  step?: number;
  initialActiveIndex?: number;
};

/**
 *
 * Tiny utility hook for handling the core logic a carousel employs. So you can  deal with your UI whichever way you want.
 *  @param numberOfItems - The total number of items your carousel intends to display
 *  @param autoSetActive - Should the hook automatically set active index at a certain interval?
 *  @param waitTime - interval before a new item is active - default: 300ms
 *  @param initialActiveIndex - the initial active item index - default: 0
 */

export const useTinyCarousel = ({
  numberOfItems,
  step = 1,
  initialActiveIndex = 0,
  autoSetActive = false,
  waitTime = 300,
}: Params) => {
  const sanitizedInitialActiveIndex = sanitizeIndex(initialActiveIndex);
  const [activeIndex, setActiveIndex] = useState(sanitizedInitialActiveIndex);

  const goBackwards = useCallback(() => {
    setActiveIndex(
      stepper({
        step,
        value: activeIndex,
        direction: 'backward',
        maxValue: numberOfItems - 1,
      })
    );
  }, [numberOfItems, activeIndex, step]);

  const goForward = useCallback(() => {
    setActiveIndex(
      stepper({
        step,
        value: activeIndex,
        direction: 'forward',
        maxValue: numberOfItems - 1,
      })
    );
  }, [numberOfItems, activeIndex, step]);

  const intervalRef = useRef<number | null>(null);

  const clearActiveInterval = () => {
    window.clearInterval(intervalRef.current || 0);
  };

  /** Set up the interval if autoSetActive is enabled */
  useEffect(() => {
    if (!autoSetActive) {
      return;
    }

    intervalRef.current = window.setInterval(goForward, waitTime);

    /** Clear interval if the components is unmounted or effect re-invoked */
    return clearActiveInterval;
  }, [waitTime, autoSetActive, goForward]);

  if (numberOfItems === 0) {
    return null;
  }

  return {
    activeIndex,
    setActiveIndex,
    goBackwards,
    goForward,
    clearCarouselInterval: clearActiveInterval,
  };
};
