declare module "*.jpg";

declare module "*useResponsiveLoader=true" {
  const value: {
    srcSet: string;
    src: string;
    placeholder: string;
    height: number;
    width: number;
  };
  export default value;
}
