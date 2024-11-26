import './styles/reset.css';
import './styles/fonts.css';
import './styles/global.css';

import { generatePoem, type PoemData } from './poem/generate';
import { createEffect, createSignal } from 'solid-js';
import { pickImages } from './images/pick';
import Renderer from './components/Renderer';

// TODO: generate a list of words in paragraphs (poems), include "blacked out" or whitespace, render using spans

const poemCount = 20;
const imagesCount = 15 * poemCount;

export default function App() {
  const [poems, setPoems] = createSignal<PoemData[]>([]);
  const [images, setImages] = createSignal<string[]>([]);

  // NOTE: doing this at root level of the component, or in memo, causes hydration mismatch
  createEffect(() => {
    setPoems([...Array(poemCount)].map(() => generatePoem()));
    setImages(pickImages(imagesCount));
  });

  return <Renderer poems={poems()} images={images()} />;
}
