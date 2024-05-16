import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

import { WalletContextProvider } from "../contexts/ContextProvider";
import { Footer } from "../components/Footer";
import { ContentContainer } from "../components/ContentContainer";
import {AppBar} from "../components/AppBar"

import Notifications from "../components/Notification";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Solana Twitter</title>
      </Head>
      <WalletContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
          </ContentContainer>
          <Footer />
        </div> 
      </WalletContextProvider>
    </>
  );
}
