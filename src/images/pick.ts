import { randomInt } from '~/utils/random';

const images = (
  Object.values(
    import.meta.glob('../content/images/*.jpg', { eager: true })
  ) as { default: string }[]
).map(image => image.default);

export const pickImages = (count = 10) => {
  return [...Array(count)].map(() => images[randomInt(images.length)]);
};
