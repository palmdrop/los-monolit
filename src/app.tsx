import './styles/reset.css';
import './styles/fonts.css';
import './styles/global.css';

import { generatePoem, type PoemData } from './poem/generate';
import { createSignal, onMount } from 'solid-js';
import { pickImages } from './images/pick';
import Renderer from './components/Renderer';

import seedrandom from 'seedrandom';

const poemCount = 10;

const getSeedFromSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const seedParam = searchParams.get('seed');
  if (!seedParam) return undefined;

  return seedParam;
};

export default function App() {
  const [poems, setPoems] = createSignal<PoemData[]>([]);
  const [images, setImages] = createSignal<string[]>([]);

  const update = (seed = Date.now().toString()) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('seed', String(seed));
    history.replaceState({}, '', `?${searchParams.toString()}`);
    seedrandom(seed, { global: true });

    const imagesCount = Math.floor((5 * window.innerHeight) / poemCount);

    setPoems([...Array(poemCount)].map(() => generatePoem()));
    setImages(pickImages(imagesCount));
  };

  onMount(() => {
    window.addEventListener('dblclick', () => update());
    update(getSeedFromSearchParams());
  });

  return <Renderer poems={poems()} images={images()} />;
}
