// main tools
import { useEffect, useContext, useState, useCallback } from "react";
import { useRouter } from "next/router";

// agora components
import { AgoraVideoPlayer } from "./AgoraVideoPlayer";

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
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

export const WaitingRoom: FC<{
  cameraTrack: ICameraVideoTrack | "NOT_ALLOWED" | null;
  microphoneTrack: IMicrophoneAudioTrack | "NOT_ALLOWED" | null;
}> = ({ cameraTrack, microphoneTrack }) => {
  const router = useRouter();
  const { sessionData, setSessionData } = useContext(agoraContext);

  const closeTracks = useCallback(async () => {
    if (!!microphoneTrack && typeof microphoneTrack !== "string")
      await microphoneTrack.close();
    if (!!cameraTrack && typeof cameraTrack !== "string")
      await cameraTrack.close();
  }, [cameraTrack, microphoneTrack]);

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

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      console.log("CHANGING PAGE");
      closeTracks();
    });

    return () => {};
  }, [router, closeTracks]);

  return (
    <div id="waitingRoomWrapper" className={styles.waitingRoomWrapper}>
      {!sessionData.videoCall.inCall &&
        !!cameraTrack &&
        sessionData.localTracks!.video && (
          <AgoraVideoPlayer
            id={sessionData.videoCall.uid!}
            track={cameraTrack as ICameraVideoTrack}
          />
        )}
      <div className={styles.waitingContent}>
        <div className={styles.waitingArea}>
          <p>
            Estamos listos, puedes invitar a otros con el siguiente codigo:{" "}
            {router.query.id}
          </p>
          <div className={styles.devices}>
            <Button
              onClick={() =>
                setSessionData({
                  ...sessionData,
                  localTracks: {
                    ...sessionData.localTracks,
                    audio: !sessionData.localTracks?.audio,
                  },
                })
              }
              className={`${styles.controlBtn} ${
                !microphoneTrack && styles.controlBtnOff
              }`}
            >
              {hasAudioDevice()}
            </Button>
            <Button
              onClick={() =>
                setSessionData({
                  ...sessionData,
                  localTracks: {
                    ...sessionData.localTracks,
                    video: !sessionData.localTracks?.video,
                  },
                })
              }
              className={`${styles.controlBtn} ${
                !cameraTrack && styles.controlBtnOff
              }`}
            >
              {hasVideoDevice()}
            </Button>
          </div>
          {sessionData.videoCall?.status !== "ENDED" && (
            <button
              className={styles.waitingBtn}
              onClick={(e) => {
                e.preventDefault();
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
