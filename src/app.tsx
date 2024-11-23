import './styles/reset.css';
import './styles/fonts.css';
import './styles/global.css';

import { words } from './content/words';
import { jublet } from './content/poems/jublet';
import { stocknaden } from './content/poems/stocknaden';

const images = (
  Object.values(
    import.meta.glob('./content/images/*.jpg', { eager: true })
  ) as { default: string }[]
).map(image => image.default);

// TODO: generate a list of words in paragraphs (poems), include "blacked out" or whitespace, render using spans

export default function App() {
  return (
    <main>
      {stocknaden.lines.map(word => (
        <p>{word}</p>
      ))}
    </main>
  );
}
