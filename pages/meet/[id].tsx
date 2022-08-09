import Navbar from "@components/Navbar";
import { AgoraContextProvider } from "AgoraUI/context/agoraContext";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const Meet: NextPage = () => {
  const [session, setSession] = useState({
    channel: "teensession",
    token:
      "0060e075146eaf3413d8afb37c048161cf3IADIwX1dkcTvmvRzZvvEvkKOd5r4zupPuWLz74rRtOvdOGEjD4wAAAAAEABUJOp9EqDxYgEAAQASoPFi",
    uid: 0,
  });
  const AgoraVideoCall = useRef<any>(null);
  useEffect(() => {
    if (AgoraVideoCall.current === null) {
      (async () => {
        const agoraComponent = await import("AgoraUI/index").then(
          (comp) => comp.AgoraVideoCall
        );

        AgoraVideoCall.current = agoraComponent;
      })();
      setSession({
        channel: "teensession",
        token:
          "0060e075146eaf3413d8afb37c048161cf3IAD2IJ6Kbsxq+ggUvI4KfCFFLTKrWrpEmM4iGR8m9WasWmEjD4wAAAAAEABUJOp9p8bzYgEAAQCnxvNi",
        uid: 0,
      });
    }
  }, [AgoraVideoCall, session]);
  return (
    <div>
      <Navbar />
      <AgoraContextProvider>
        {!!AgoraVideoCall.current && <AgoraVideoCall.current {...session} />}
      </AgoraContextProvider>
    </div>
  );
};

export default Meet;
