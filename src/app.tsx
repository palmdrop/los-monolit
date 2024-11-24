import './styles/reset.css';
import './styles/fonts.css';
import './styles/global.css';

import { words } from './content/words';
import { jublet } from './content/poems/jublet';
import { stocknaden } from './content/poems/stocknaden';
import { generatePoem } from './poem/generate';
import { createEffect, createMemo, createSignal, For } from 'solid-js';

const images = (
  Object.values(
    import.meta.glob('./content/images/*.jpg', { eager: true })
  ) as { default: string }[]
).map(image => image.default);

// TODO: generate a list of words in paragraphs (poems), include "blacked out" or whitespace, render using spans

export default function App() {
  const [poemLines, setPoemLines] = createSignal<
    ReturnType<typeof generatePoem>
  >([]);

  // NOTE: doing this at root level of the component, or in memo, causes hydration mismatch
  createEffect(() => {
    setPoemLines(generatePoem());
  });

  return (
    <main>
      {
        <p class="poem">
          <For each={poemLines()}>
            {({ line, isBlank, source }) => (
              <>
                <span classList={{ blank: isBlank, [source]: true }}>
                  {line}
                </span>
                <span
                  classList={{ blank: true, separator: true, [source]: true }}
                >
                  {' '}
                  _
                </span>
              </>
            )}
          </For>
        </p>
      }
    </main>
  );
}
