import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

import {HomeView} from "../views"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Head>
        <title>Sol Chirp</title>
        <meta name="description" content="Solana Twitter" />
      </Head>
      <HomeView />
    </div>
  );
}
