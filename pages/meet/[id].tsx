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
            "0060e075146eaf3413d8afb37c048161cf3IAD2IJ6Kbsxq+ggUvI4KfCFFLTKrWrpEmM4iGR8m9WasWmEjD4wAAAAAEABUJOp9p8bzYgEAAQCnxvNi",
          uid: 0,
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
