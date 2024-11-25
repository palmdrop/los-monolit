import { random } from '~/utils/random';

export const setupCanvas = (
  canvas: HTMLCanvasElement,
  images: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _parent: HTMLElement
) => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.fillStyle = 'red';
  context.fillRect(0, 0, canvas.width, canvas.height);

  images.forEach(image => {
    const imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = () => {
      const imageWidth = Math.min(imageElement.width * random(0.2, 0.5), width);
      const imageHeight =
        (imageWidth / imageElement.width) * imageElement.height;

      const imageX = random(-imageWidth * 0.5, width - imageWidth * 0.5);

      const imageY = random(-imageHeight * 0.5, height - imageHeight * 0.5);

      context.drawImage(imageElement, imageX, imageY, imageWidth, imageHeight);
      // parent.style.backgroundImage = `url(${canvas.toDataURL()})`;
    };
  });
};
