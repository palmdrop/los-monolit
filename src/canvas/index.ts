import { random } from '~/utils/random';

const normalSettings = (context: CanvasRenderingContext2D) => {
  const colorRotation = -0;
  const sepia = 100;
  const saturation = 100; // THIS IS INSANE GOO
  // const saturation = 100;
  context.fillStyle = 'white';
  context.filter = `blur(4px) brightness(75%) sepia(${sepia}%) contrast(200%) hue-rotate(${colorRotation}deg) saturate(${saturation}%)`;
  context.globalAlpha = 0.55;
  context.globalCompositeOperation = 'difference';
};

const gooSettings = (context: CanvasRenderingContext2D) => {
  const colorRotation = -0;
  const sepia = 100;
  const saturation = 5000;
  context.fillStyle = 'white';
  context.filter = `blur(5px) brightness(65%) sepia(${sepia}%) contrast(210%) hue-rotate(${colorRotation}deg) saturate(${saturation}%)`;
  context.globalAlpha = 0.55;
  context.globalCompositeOperation = 'difference';
};

const neonSettings = (context: CanvasRenderingContext2D) => {
  const colorRotation = -210;
  const sepia = 90;
  const saturation = 5000;
  context.fillStyle = 'white';
  context.filter = `blur(5px) brightness(60%) sepia(${sepia}%) contrast(210%) hue-rotate(${colorRotation}deg) saturate(${saturation}%)`;
  context.globalAlpha = 0.55;
  context.globalCompositeOperation = 'hard-light';
};

const neon2Settings = (context: CanvasRenderingContext2D) => {
  const colorRotation = -240;
  const sepia = 100;
  const saturation = 1000;
  context.fillStyle = 'white';
  context.filter = `blur(5px) brightness(60%) sepia(${sepia}%) contrast(210%) hue-rotate(${colorRotation}deg) saturate(${saturation}%)`;
  context.globalAlpha = 0.65;
  context.globalCompositeOperation = 'hard-light';
};

const adaptiveSettings = (
  context: CanvasRenderingContext2D,
  deltaY: number
) => {
  const n = deltaY ** 3.5;
  const blur = 3 + n * 6;
  const colorRotation = -10 + 60 * n;
  const sepia = 100;
  // const saturation = 100 + 10000 * n;
  const saturation = 100 + 10000 * n - 10000 * n ** 2;
  context.fillStyle = 'white';
  context.filter = `blur(${blur}px) brightness(65%) sepia(${sepia}%) contrast(200%) hue-rotate(${colorRotation}deg) saturate(${saturation}%)`;
  context.globalAlpha = 0.55 + 0.55 * n;
  context.globalCompositeOperation = 'difference';
};

export const renderCanvas = (canvas: HTMLCanvasElement, images: string[]) => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return;

  // normalSettings(context);
  // gooSettings(context);

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

      const deltaY = (imageY + imageHeight * 0.5) / height;

      // neon2Settings(context);
      adaptiveSettings(context, deltaY);
      context.drawImage(imageElement, imageX, imageY, imageWidth, imageHeight);
    };
  });
};
