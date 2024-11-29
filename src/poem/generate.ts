import { words } from '../content/words';
import { jublet } from '../content/poems/jublet';
import { stocknaden } from '../content/poems/stocknaden';
import { random, randomInt } from '~/utils/random';

export type Source = 'stocknaden' | 'jublet' | 'word';

export type LineData = {
  isBlank: boolean;
  source: Source;
  line: string;
};

export type NewLine = 'newline';

export type PoemData = (LineData | NewLine)[];

const randomWord = () => words[randomInt(words.length)];

const randomStocknaden = () =>
  stocknaden.lines[randomInt(stocknaden.lines.length)];

const randomJublet = () => jublet.lines[randomInt(jublet.lines.length)];

// TODO: add weights
const randomLine = ({
  stocknadenWeight = 0.5,
  jubletWeight = 0.2,
  wordWeight = 0.3
}: {
  stocknadenWeight?: number;
  jubletWeight?: number;
  wordWeight?: number;
} = {}): Omit<LineData, 'isBlank'> => {
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
  length = randomInt(10, 15),
  blankProbability = 0.3,
  newLineProbability = 0.15
): PoemData => {
  let previousBlank = false;
  return [...Array(length)].map(randomLine).flatMap(({ line, source }, i) => {
    const isBlank = i !== length - 1 && random() < blankProbability;
    const transformedLine =
      i === 0 || previousBlank || source === 'word'
        ? line
        : `${line.at(0)?.toUpperCase()}${line.slice(1)}`;

    previousBlank = isBlank;

    const result: PoemData = [
      {
        isBlank,
        source,
        line: transformedLine
      }
    ];

    if (!isBlank && i !== length - 1 && random() < newLineProbability) {
      result.push('newline');
    }

    return result;
  });
};
