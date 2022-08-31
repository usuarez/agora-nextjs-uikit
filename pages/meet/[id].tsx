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
          channel: "lcn-xns",
          token:
            "007eJxTYAh57GB1xDz7aP8G8d1S554Fm51+9vK8mQnPLc3nVVX2NzwUGAxSDcxNDU3MUhPTjE0MjVMsEtOSjM2TDUwsDM0Mk9OMZ6zkSxb/zZ9ss+EYCyMDBIL47Aw5yXm6FXnFDAwA+k4iZA==",
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
