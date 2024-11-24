import './styles/reset.css';
import './styles/fonts.css';
import './styles/global.css';

import { generatePoem, type PoemData } from './poem/generate';
import { createEffect, createSignal, For } from 'solid-js';
import { Poem } from './components/Poem';

const images = (
  Object.values(
    import.meta.glob('./content/images/*.jpg', { eager: true })
  ) as { default: string }[]
).map(image => image.default);

// TODO: generate a list of words in paragraphs (poems), include "blacked out" or whitespace, render using spans

const poemCount = 10;

export default function App() {
  const [poems, setPoems] = createSignal<PoemData[]>([]);

  // NOTE: doing this at root level of the component, or in memo, causes hydration mismatch
  createEffect(() => {
    // setPoem(generatePoem());
    setPoems([...Array(poemCount)].map(() => generatePoem()));
  });

  return (
    <main>
      <For each={poems()}>{poem => <Poem poem={poem} />}</For>
    </main>
  );
}
