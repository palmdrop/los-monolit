import { random } from '~/utils/random';

export const renderCanvas = (canvas: HTMLCanvasElement, images: string[]) => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return;

  // NOTE: or just blue box background, looks pretty good
  context.fillStyle = 'white';
  context.filter =
    'blur(4px) brightness(55%) sepia() contrast(200%) saturate(100%)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 0.35;
  // context.globalCompositeOperation = 'luminosity';
  context.globalCompositeOperation = 'difference';

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
