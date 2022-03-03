import "../styles/globals.css";
import "../node_modules/codemirror/lib/codemirror.css";
import "../node_modules/codemirror/theme/seti.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
