import "../styles/globals.css";

import react from "react";
import { Layout } from "../components/Layout";

import { StateContext } from "../context/StateContext";
import { Toaster } from "react-hot-toast";


export default function MyApp({ Component, pageProps }) {
  return (
    <StateContext>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>
  );
}
