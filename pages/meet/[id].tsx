import Navbar from "@components/Navbar";
import { AgoraContextProvider } from "AgoraUI/context/agoraContext";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const Meet: NextPage = () => {
  const [session, setSession] = useState({
    channel: "teensession",
    token: "",
    uid: 0,
  });
  const AgoraVideoCall = useRef<any>(null);

  useEffect(() => {
    const dynamicImport = async () => {
      await import("AgoraUI/index").then((comp) => {
        AgoraVideoCall.current = comp.AgoraVideoCall;
      });
    };
    if (AgoraVideoCall.current === null) {
      dynamicImport().then(() => {
        setSession({
          channel: "teensession",
          token:
            "0060e075146eaf3413d8afb37c048161cf3IAC0x+IkPf3WJwYyaf5TJBVg/LQ4GDXuutsg2k4toOqpoGEjD4wAAAAAEACxI7THdrH3YgEAAQB2sfdi",
          uid: Math.floor(Math.random() * 1000),
        });
      });
    }
  }, [session.token]);
  return (
    <div>
      <Navbar />
      <AgoraContextProvider>
        {session.token !== "" && <AgoraVideoCall.current {...session} />}
      </AgoraContextProvider>
    </div>
  );
};

export default Meet;
