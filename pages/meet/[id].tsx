import Navbar from "@components/Navbar";
import { AgoraContextProvider } from "AgoraUI/context/agoraContext";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { getRTCTokens } from "services/meet";

const Meet: NextPage = () => {
  const router = useRouter();
  const [session, setSession] = useState({
    channel: "teensession",
    token: "",
    uid: 0,
    screenToken: "",
    screenUid: 0,
  });
  const AgoraVideoCall = useRef<any>(null);

  useEffect(() => {
    const dynamicImport = async () => {
      await import("AgoraUI/index").then((comp) => {
        AgoraVideoCall.current = comp.AgoraVideoCall;
      });
      const sdata = await getRTCTokens(router.query.id as string);
      if (sdata) setSession(sdata);
    };
    if (AgoraVideoCall.current === null) {
      dynamicImport();
    }
  }, [session.token, router.query.id]);
  return (
    <div>
      <Navbar />
      <AgoraContextProvider>
        {session.token !== "" ? (
          <AgoraVideoCall.current {...session} />
        ) : (
          <div
            className="d-flex justify-content-center flex-column align-items-center"
            style={{
              height: "90vh",
            }}
          >
            <p>Cargando los datos de la reunion, por favor espera</p>
            <Spinner animation="border" />
            <p>
              La solicitud podria tardar 30 segundos debido a la suspension del
              servicio gratuito
            </p>
          </div>
        )}
      </AgoraContextProvider>
    </div>
  );
};

export default Meet;
