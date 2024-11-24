import { words } from '../content/words';
import { jublet } from '../content/poems/jublet';
import { stocknaden } from '../content/poems/stocknaden';

type Source = 'stocknaden' | 'jublet' | 'word';

const random = (a = 1, b?: number) => {
  const hasB = typeof b === 'number';
  const min = hasB ? a : 0;
  const max = hasB ? b : a;
  return Math.random() * (max - min) + min;
};

const randomInt = (a = 1, b?: number) => Math.floor(random(a, b));

const randomWord = () => words[randomInt(words.length)];

const randomStocknaden = () =>
  stocknaden.lines[randomInt(stocknaden.lines.length)];

const randomJublet = () => jublet.lines[randomInt(jublet.lines.length)];

// TODO: add weights
const randomLine = ({
  stocknadenWeight = 0.5,
  jubletWeight = 0.35,
  wordWeight = 0.15
}: {
  stocknadenWeight?: number;
  jubletWeight?: number;
  wordWeight?: number;
} = {}) => {
  const r = random();

  let line = '';
  let source: Source = 'word';

  if (r < stocknadenWeight) {
    line = randomStocknaden();
    source = 'stocknaden';
  } else if (r < stocknadenWeight + jubletWeight) {
    line = randomJublet();
    source = 'jublet';
  } else if (r < stocknadenWeight + jubletWeight + wordWeight) {
    line = randomWord();
    source = 'word';
  }

  return {
    line,
    source
  };
};

export const generatePoem = (
  length = randomInt(5, 15),
  blankProbability = 0.5
) => {
  return [...Array(length)].map(randomLine).map(({ line, source }) => {
    const isBlank = random(0, 1) < blankProbability;
    return {
      isBlank,
      source,
      line: isBlank ? line.replace(/./g, '_') : line
    };
  });
};
