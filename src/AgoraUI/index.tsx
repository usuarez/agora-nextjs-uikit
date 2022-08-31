// main tools
import { useEffect, useContext, useState } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

// components
import { WaitingRoom } from "./components/WaitingRoom";
import { agoraContext } from "./context/agoraContext";
import { VideoCall } from "./components/VideoCall";

// types
import { VideoCallProps } from "types/Agora";
import { FC } from "react";
import { useRouter } from "next/router";
import { checkClientBrowser } from "lib/checkClientBrowser";
import { createMicrophoneTrack } from "./lib/createMicrophoneTrack";
import { createCameraTrack } from "./lib/createCameraTrack";
export const AgoraVideoCall: FC<VideoCallProps> = ({
  token,
  screenToken,
  channel,
  uid,
  role,
}) => {
  const useClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  const { sessionData, setSessionData } = useContext(agoraContext);
  const [availableDevices, setavailableDevices] = useState<string[]>([]);
  const [cameraTrack, setCameraTrack] = useState<
    ICameraVideoTrack | "NOT_ALLOWED" | null
  >(null);
  const [microphoneTrack, setMicrophoneTrack] = useState<
    IMicrophoneAudioTrack | "NOT_ALLOWED" | null
  >(null);
  const appId: string = process.env.NEXT_PUBLIC_AGORA_ID!;

  const createTracks = async () => {
    if (availableDevices.length > 0) {
      if (availableDevices.includes("audioinput"))
        await createMicrophoneTrack(setMicrophoneTrack);
      else setMicrophoneTrack("NOT_ALLOWED");

      if (availableDevices.includes("videoinput"))
        await createCameraTrack(setCameraTrack);
      else setCameraTrack("NOT_ALLOWED");
    }
  };
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((data) => setavailableDevices(data.map((dev) => dev.kind)));
    availableDevices.length > 0 && createTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDevices.length]);
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
          cameraTrack={cameraTrack}
          microphoneTrack={microphoneTrack}
          useClient={useClient}
          appId={"0e075146eaf3413d8afb37c048161cf3"}
        />
      ) : (
        <WaitingRoom
          cameraTrack={cameraTrack as ICameraVideoTrack}
          microphoneTrack={microphoneTrack as IMicrophoneAudioTrack}
        />
      )}
    </div>
  );
};
