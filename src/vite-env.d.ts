declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
/// <reference types="vite/client" />