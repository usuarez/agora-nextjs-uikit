// main tools
import { useEffect, useState, useContext, useCallback, useRef } from "react";

// agora
import AgoraRTC from "agora-rtc-sdk-ng";

import { Videos } from "./Videos";
import { Controls } from "./Controls";
import { agoraContext } from "../context/agoraContext";

// styles
import styles from "styles/Agora.module.scss";

// types
import {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { FC } from "react";
import { useRouter } from "next/router";
import { startScreenCall } from "../lib/ScreenCall";
import { VideoCallInit } from "../lib/VideoCall";

type VideoCallProps = {
  useClient: IAgoraRTCClient;
  cameraTrack: ICameraVideoTrack | "NOT_ALLOWED" | null;
  microphoneTrack: IMicrophoneAudioTrack | "NOT_ALLOWED" | null;
};

export const VideoCall: FC<VideoCallProps> = ({
  useClient,
  cameraTrack,
  microphoneTrack,
}) => {
  const appId = process.env.NEXT_PUBLIC_PUBLIC_AGORA_ID as string;
  const callClient = useClient;
  const [screenClient, setscreenClient] = useState<IAgoraRTCClient | null>(
    useClient
  );
  const router = useRouter();
  const [devicesReady, setDevicesReady] = useState(false);
  const { sessionData, setSessionData } = useContext(agoraContext);
  const [availableDevices, setavailableDevices] = useState<string[]>([]);
  const { videoCall, screenCall, localTracks } = sessionData;
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);

  const StartScreenShare = useCallback(() => {
    startScreenCall({
      appId,
      screenTrack: screenTrack!,
      setScreenTrack,
      sessionData,
      setSessionData,
      client: screenClient!,
    });
  }, [screenTrack]);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((data) => setavailableDevices(data.map((dev) => dev.kind)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableDevices.length]);

  useEffect(() => {
    //starts the session when local tracks start
    if (
      videoCall.inCall &&
      !localTracks?.areTracksPublished &&
      availableDevices.length > 0
    ) {
      if (microphoneTrack !== null && cameraTrack !== null)
        setDevicesReady(true);
    }
  }, [
    videoCall.inCall,
    microphoneTrack,
    cameraTrack,
    devicesReady,
    localTracks?.areTracksPublished,
    availableDevices,
  ]);

  useEffect(() => {
    if (
      devicesReady &&
      !localTracks?.areTracksPublished &&
      availableDevices.length > 0
    )
      VideoCallInit({
        appId,
        sessionData,
        setSessionData,
        microphoneTrack,
        cameraTrack,
        client: callClient,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesReady, microphoneTrack, cameraTrack, availableDevices]);

  useEffect(() => {
    router.events.on("routeChangeStart", async () => {
      await callClient.leave();
      !!screenClient && (await screenClient!.leave());
    });
  }, [router]);

  //ScreenCall Effects
  //ScreenCall Effects
  //ScreenCall Effects
  //ScreenCall Effects
  //ScreenCall Effects
  useEffect(() => {
    if (!screenTrack && screenCall?.inCall && screenCall.status === "INCALL") {
      (async () => {
        await AgoraRTC.createScreenVideoTrack(
          { optimizationMode: "detail" },
          "disable" //withAudio:disable
        )
          .then((localScreenTrack) => setScreenTrack(localScreenTrack))
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [screenCall.inCall, screenTrack, screenCall.status]);

  useEffect(() => {
    if (!screenCall?.inCall && screenCall?.status === "LEAVING") {
      screenTrack?.close();
      setScreenTrack(null);
      const leaveScreenCall = async () => {
        await screenClient!.leave().then(() => {
          setSessionData((pr) => {
            return {
              ...pr,
              screenCall: {
                ...pr.screenCall,
                status: "ENDED",
              },
            };
          });
        });
        screenClient?.removeAllListeners();
        setscreenClient(null);
      };

      leaveScreenCall().finally(() => {
        setscreenClient(useClient);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenTrack, screenCall?.inCall, screenCall?.status, appId]);

  useEffect(() => {
    if (!!screenCall.inCall && !!screenTrack) {
      if (!!screenClient) StartScreenShare();
      /**
       startScreenCall({
         appId,
         screenTrack,
         setScreenTrack,
         sessionData,
         setSessionData,
         client: screenClient,
       })
       * 
       */

      setSessionData((pr) => {
        return {
          ...pr,
          screenCall: {
            ...pr.screenCall,
            status: "INCALL",
          },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenTrack, screenCall?.inCall, screenCall?.status, screenClient]);

  return (
    <div id="mindfitMeet" className={styles.meetWrapper}>
      {
        //devicesReady && localTracks?.areTracksPublished && (
        //)
      }
      <Controls
        videoTrack={cameraTrack as ICameraVideoTrack}
        audioTrack={microphoneTrack as IMicrophoneAudioTrack}
        screenTrack={screenTrack!}
        client={callClient}
      />
      {
        //sessionData.localTracks?.areTracksPublished && (
        //)
      }
      <Videos
        localScreenTrack={screenTrack}
        localVideo={cameraTrack !== "NOT_ALLOWED" ? cameraTrack : null}
      />
    </div>
  );
};
