import { generateNames } from "@lib/generateNames";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "styles/Home.module.scss";

const Home: NextPage = () => {
  const [channelName, setchannelName] = useState(generateNames());
  const router = useRouter();
  const handleStartMeet = () => {
    router.push(`/meet/${channelName}`);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Umeets</title>
        <meta name="description" content="Connecting teams" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.newMeet}>
          <h3>Inicia una nueva reunión o unete</h3>
          <div className={styles.starterContainer}>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setchannelName(e.target.value)}
              placeholder="code.."
            />
            <Button onClick={handleStartMeet}>Entrar</Button>
          </div>
          <div className={styles.features}>
            <p>En Umeets proveemos sesiones gratuitas de alta calidad con</p>
            <ul>
              <li>Hasta 180 minutos de llamada de audio y video</li>
              <li>Presentar pantalla</li>
              <li>Maximo 10 participantes</li>
            </ul>
          </div>
        </div>
        <div className={styles.joinMeet}>
          <h3>Tienes un codigo? Unete!</h3>
          <div className="">
            <input type="text" name="code" placeholder="code.." />
            <Button>Entrar</Button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
