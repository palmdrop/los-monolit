import { createEffect, For } from 'solid-js';
import { PoemData } from '~/poem/generate';
import { Poem } from './Poem';
import { setupCanvas } from '~/canvas';

type Props = {
  poems: PoemData[];
  images: string[];
};

export default function Renderer(props: Props) {
  let mainElement: HTMLElement;
  let canvasElement: HTMLCanvasElement;

  createEffect(() => {
    setTimeout(() => {
      if (mainElement && canvasElement) {
        setupCanvas(canvasElement, props.images, mainElement);
      }
    }, 10);
  });

  // NOTE: doing this at root level of the component, or in memo, causes hydration mismatch
  return (
    <main
      ref={element => {
        mainElement = element;
      }}
    >
      <For each={props.poems}>{poem => <Poem poem={poem} />}</For>
      {/* 
      <div class="images">
        <For each={images()}>{image => <img src={image} />}</For>
      </div>
      */}
      <canvas
        ref={element => {
          canvasElement = element;
        }}
      />
    </main>
  );
}
