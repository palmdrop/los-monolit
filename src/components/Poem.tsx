import { For, Show } from 'solid-js';
import { PoemData } from '~/poem/generate';

type Props = {
  poem: PoemData;
};

export const Poem = (props: Props) => {
  return (
    <p class="poem">
      <For each={props.poem}>
        {({ line, isBlank, source }) => (
          <>
            <span
              classList={{ blank: isBlank, [source]: true, line: !isBlank }}
            >
              {line}
            </span>
            {
              <Show when={!isBlank}>
                <span classList={{ separator: true, [source]: true }}> ,</span>
              </Show>
            }
          </>
        )}
      </For>
    </p>
  );
};
