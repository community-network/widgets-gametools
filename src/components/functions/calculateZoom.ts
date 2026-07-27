export function calculateZoomStyle(zoom: string | number | undefined) {
  return {
    width: `${(100 / Number(zoom)) * 100}%`,
    height: `${(100 / Number(zoom)) * 100}%`,
    transform: `scale(
         ${Number(zoom) / 100},
         ${Number(zoom) / 100}
        )`,
  };
}
