// main tools
import { useEffect, useContext } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

// components
import { WaitingRoom } from "./components/WaitingRoom";
import { agoraContext } from "./context/agoraContext";
import { VideoCall } from "./components/VideoCall";

// types
import { VideoCallProps } from "types/Agora";
import { FC } from "react";
import { useRouter } from "next/router";
import { checkClientBrowser } from "lib/checkClientBrowser";
export const AgoraVideoCall: FC<VideoCallProps> = ({
  token,
  screenToken,
  channel,
  uid,
  role,
}) => {
  const useClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const { sessionData, setSessionData } = useContext(agoraContext);
  const appId: string = process.env.NEXT_PUBLIC_AGORA_ID!;
  const router = useRouter();

  useEffect(() => {
    setSessionData((prev) => ({
      ...prev,
      videoCall: {
        uid,
        role,
        token,
        inCall: false,
      },
      screenCall: {
        token: screenToken,
        uid: uid + 100000,
        inCall: false,
      },
      channel: {
        name: channel,
        users: {},
      },
    }));
  }, [channel, role, setSessionData, token, uid, screenToken]);
  /*
   **Detect client browser to prevent the screen sharing in application mode for firefox
   */
  useEffect(() => {
    console.log(checkClientBrowser());
  }, []);

  return (
    <div>
      {sessionData.videoCall.inCall ? (
        <VideoCall
          useClient={useClient}
          appId={"0e075146eaf3413d8afb37c048161cf3"}
        />
      ) : (
        <WaitingRoom />
      )}
    </div>
  );
};
