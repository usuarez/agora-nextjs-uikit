// main tools
import { useEffect, useContext, useState, useCallback } from "react";
import { useRouter } from "next/router";

// agora
import AgoraRTC, {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

// context
import { agoraContext } from "./../context/agoraContext";

// bootstrap components
import {
  Mic,
  MicMute,
  CameraVideo,
  CameraVideoOff,
} from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

// styles
import styles from "styles/Agora.module.scss";

// types
import { FC } from "react";
import { AgoraVideoPlayer } from "./AgoraVideoPlayer";

export const WaitingRoom: FC = () => {
  const router = useRouter();
  const [message, setmessage] = useState("");
  const { sessionData, setSessionData } = useContext(agoraContext);
  const [availableDevices, setavailableDevices] = useState<string[]>([]);
  const [micTrack, setmicTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [cameraTrack, setCameraTrack] = useState<ICameraVideoTrack | null>(
    null
  );

  const closeTracks = useCallback(async () => {
    if (micTrack) await micTrack.close();
    if (cameraTrack) await cameraTrack.close();
  }, [cameraTrack, micTrack]);

  const hasAudioDevice = () => {
    if (sessionData.localTracks?.audio) {
      return <Mic width={24} height={24} />;
    } else {
      return <MicMute width={24} height={24} />;
    }
  };

  const hasVideoDevice = () => {
    if (sessionData.localTracks?.video)
      return <CameraVideo width={24} height={24} />;
    else return <CameraVideoOff width={24} height={24} />;
  };

  /**
   * -------------------------------------
   * Device detection
   * -------------------------------------
   */
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((data) => {
      setavailableDevices(data.map((dev) => dev.kind));
    });
    if (availableDevices.includes("audioinput"))
      AgoraRTC.getMicrophones()
        .then((devices) => {
          AgoraRTC.createMicrophoneAudioTrack().then((mic) => {
            setmicTrack(mic);
          });
        })
        .catch((e) => {
          console.log("get devices error!", e);
        });

    if (availableDevices.includes("videoinput"))
      AgoraRTC.getCameras()
        .then((devices) => {
          AgoraRTC.createCameraVideoTrack().then((cam) => {
            setCameraTrack(cam);
          });
        })
        .catch((e) => {
          console.log("get devices error!", e);
        });
  }, [availableDevices.length]);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      console.log("CHANGING PAGE");
      closeTracks();
    });

    return () => {};
  }, [router, closeTracks]);

  /**
   * -------------------------------------
   * Device mute state handling
   * -------------------------------------
   
 useEffect(() => {
   if (
     !!cameraTrack &&
     cameraTrack.muted === sessionData.localTracks?.video
   )
   //We can't publish or set enabled tracks muted  
   //cameraTrack.setMuted(!sessionData.localTracks?.video)
   if (!!micTrack && micTrack.muted === sessionData.localTracks?.audio)
   //We can't publish or set enabled tracks muted  
   //micTrack.setMuted(!sessionData.localTracks?.audio)
  }, [sessionData.localTracks?.video, sessionData.localTracks?.audio])
  */

  return (
    <div id="waitingRoomWrapper" className={styles.waitingRoomWrapper}>
      {!sessionData.videoCall.inCall &&
        !!cameraTrack &&
        sessionData.localTracks!.video && (
          <AgoraVideoPlayer
            id={sessionData.videoCall.uid!}
            track={cameraTrack!}
          />
        )}
      <div className={styles.waitingContent}>
        <div className={styles.waitingArea}>
          <p>Estamos listos, puedes ingresar cuando quieras</p>
          <div className={styles.devices}>
            <Button
              onClick={() => {
                setSessionData({
                  ...sessionData,
                  localTracks: {
                    ...sessionData.localTracks,
                    audio: !sessionData.localTracks?.audio,
                  },
                });
              }}
              className={`${styles.controlBtn} ${
                !micTrack && styles.controlBtnOff
              }`}
            >
              {hasAudioDevice()}
            </Button>
            <Button
              onClick={() => {
                setSessionData({
                  ...sessionData,
                  localTracks: {
                    ...sessionData.localTracks,
                    video: !sessionData.localTracks?.video,
                  },
                });
              }}
              className={`${styles.controlBtn} ${
                !cameraTrack && styles.controlBtnOff
              }`}
            >
              {hasVideoDevice()}
            </Button>
          </div>
          <p>{message}</p>
          {sessionData.videoCall?.status !== "ENDED" && (
            <button
              className={styles.waitingBtn}
              onClick={(e) => {
                e.preventDefault();
                closeTracks();
                setSessionData((pr) => {
                  return {
                    ...sessionData,
                    videoCall: {
                      ...pr.videoCall,
                      inCall: true,
                      status: "INCALL",
                    },
                  };
                });
              }}
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
