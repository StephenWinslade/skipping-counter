import Head from "next/head";
import { PoseNet } from "./components/PoseNet";
export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Head>
        <title>Create Next App</title>
      </Head>
      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p>
          Get started by editing <code>pages/index.tsx</code>
        </p>
        <PoseNet />
      </main>
    </div>
  );
}
