// main tools
import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";

// context
import { agoraContext } from "../context/agoraContext";

// bootstrap icons
import {
  Mic,
  MicMute,
  Telephone,
  Fullscreen,
  CameraVideo,
  CameraVideoOff,
  FullscreenExit,
  Easel3,
} from "react-bootstrap-icons";

// styles
import styles from "styles/Agora.module.scss";

// types
import {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { EndCallModal } from "./EndCallModal";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { TooltipWrapper } from "@components/atoms/TooltipWrapper";
import { handleShareScreen } from "AgoraUI/lib/handleShareScreen";

export const Controls = (props: {
  audioTrack: IMicrophoneAudioTrack | null;
  videoTrack: ICameraVideoTrack | null;
  screenTrack?: ILocalVideoTrack;
  client: IAgoraRTCClient;
}) => {
  const { audioTrack, videoTrack, screenTrack, client } = props;
  const { sessionData, setSessionData } = useContext(agoraContext);
  const { channel } = sessionData;
  const [showEndModal, setshowEndModal] = useState(false);
  const [activeUsers, setactiveUsers] = useState<string[]>([]);
  const router = useRouter();
  const [disableShareScreen, setDisableShareScreen] = useState(false);
  const setCantShareScreen = () => {
    setDisableShareScreen(true);
    const timer = setTimeout(() => {
      setDisableShareScreen(false);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const x = () => {
    if (
      !sessionData.screenCall.inCall ||
      ["NOT_STARTED", "ENDED"].includes(sessionData?.screenCall?.status!)
    ) {
      setSessionData((pr) => {
        return {
          ...pr,
          screenCall: {
            ...pr.screenCall,
            inCall: true,
            status: "INCALL",
          },
        };
      });
    } else if (
      sessionData.screenCall.inCall &&
      sessionData.screenCall.status !== "LEAVING"
    ) {
      setSessionData((pr) => {
        return {
          ...pr,
          screenCall: {
            ...pr.screenCall,
            inCall: false,
            status: "LEAVING",
          },
        };
      });
    }

    if (!!screenTrack?.isPlaying) {
      setCantShareScreen();
    }
  };
  useEffect(() => {
    if (!!screenTrack) {
      screenTrack!.on("track-ended", () => {
        setCantShareScreen();
        setSessionData((pr) => {
          return {
            ...pr,
            screenCall: {
              ...pr.screenCall,
              inCall: false,
              status: "LEAVING",
            },
          };
        });
      });
    }
  }, [screenTrack]);

  useEffect(() => {
    if (!!channel?.users) {
      const screenInChannel = Object.keys(channel?.users!).find(
        (k) => Number(k) > 100000
      );
      if (!!screenInChannel) {
        setSessionData((sd) => {
          return { ...sd, inScreenCall: true };
        });
      }
      if (
        !!screenInChannel &&
        screenInChannel !== sessionData?.screenCall?.uid!.toString()
      ) {
        setDisableShareScreen(true);
      } else {
        setDisableShareScreen(false);
      }
    }
  }, [channel?.users, sessionData?.screenCall?.uid, setSessionData]);

  /**
   * Toggle Tracks and fullscreen
   */
  const toggleAudio = async () => {
    !!audioTrack &&
      (await audioTrack.setMuted(!sessionData.localTracks!.audio));
    setSessionData((pr) => ({
      ...pr,
      localTracks: {
        ...pr.localTracks,
        audio: !pr.localTracks!.audio,
      },
    }));
  };
  const toggleVideo = async () => {
    !!videoTrack &&
      (await videoTrack.setMuted(!sessionData.localTracks!.video));
    setSessionData((pr) => ({
      ...pr,
      localTracks: {
        ...pr.localTracks,
        video: !pr.localTracks!.video,
      },
    }));
  };
  const toggleFullScreen = () => {
    const meetWrapper = document.getElementById("mindfitMeet");
    if (!document.fullscreenElement) meetWrapper?.requestFullscreen();
    else if (!!document.fullscreenElement) document.exitFullscreen();
  };

  /**
   * Toggle Tracks and fullscreen ends
   */
  const leaveChannel = useCallback(
    async (status: string) => {
      if (status !== "LOSS")
        setSessionData((prev) => ({ ...prev, inCall: false, status }));
      // we close the tracks and events to perform cleanup
      await client.leave();
      client.removeAllListeners();
      if (audioTrack) await audioTrack.close();
      if (videoTrack) await videoTrack.close();
      if (screenTrack) await screenTrack.close();

      if (status !== "LOSS")
        setSessionData((prev) => ({
          ...prev,
          inCall: false,
          areTracksPublished: false,
        }));
    },
    [audioTrack, client, setSessionData, videoTrack, screenTrack]
  );

  /**
   * clean call events when local user abandon the call using navigation
   */
  useEffect(() => {
    router.events.on("routeChangeStart", async () => {
      await leaveChannel("LOSS");
    });
  }, [router, leaveChannel]);

  /**
   * When we loss the conn with the remote user
   */
  useEffect(() => {
    if (
      !!channel?.users &&
      !!Object.keys(channel?.users!) &&
      Object.keys(channel?.users!).length > 0
    ) {
      setactiveUsers(Object.keys(channel?.users!));
    } else if (
      !!channel?.users &&
      Object.keys(channel?.users!).length === 0 &&
      activeUsers.length === 1
    ) {
      if (sessionData.videoCall.status === "INCALL") {
        setSessionData((prev) => ({
          ...prev,
          status: "LOSS",
        }));
      }
    }
  }, [
    channel?.users!,
    activeUsers.length,
    setSessionData,
    sessionData.videoCall!.status,
  ]);

  useEffect(() => {
    if (sessionData.localTracks!.areTracksPublished) {
      !!audioTrack &&
        audioTrack.muted === sessionData.localTracks!.audio &&
        toggleAudio();

      !!videoTrack &&
        videoTrack.muted === sessionData.localTracks!.video &&
        toggleVideo();
    }
  }, []);

  return (
    <div className={styles.controls}>
      <div className={styles.mainControls}>
        <TooltipWrapper text={!!screenTrack ? "Stop sharing" : "Share screen"}>
          <Button
            onClick={() =>
              handleShareScreen(
                sessionData,
                setSessionData,
                setCantShareScreen,
                !!screenTrack?.isPlaying
              )
            }
            disabled={disableShareScreen}
            className={`${styles.controlBtn}`}
          >
            <Easel3 width={24} height={24} />
          </Button>
        </TooltipWrapper>

        <TooltipWrapper
          text={!audioTrack?.muted ? "Mute microphone" : "Unmute microphone"}
        >
          <Button onClick={toggleAudio} className={`${styles.controlBtn}`}>
            {audioTrack && !audioTrack.muted ? (
              <Mic width={24} height={24} />
            ) : (
              <MicMute width={24} height={24} />
            )}
          </Button>
        </TooltipWrapper>
        <TooltipWrapper
          text={!videoTrack?.muted ? "Mute camera" : "Unmute camera"}
        >
          <Button onClick={toggleVideo} className={`${styles.controlBtn}`}>
            {videoTrack && !videoTrack.muted ? (
              <CameraVideo width={24} height={24} />
            ) : (
              <CameraVideoOff width={24} height={24} />
            )}
          </Button>
        </TooltipWrapper>
        <TooltipWrapper text={"End call"}>
          <Button
            onClick={() => setshowEndModal(true)}
            className={`${styles.controlBtn} ${styles.leave}`}
          >
            <Telephone width={24} height={24} />
          </Button>
        </TooltipWrapper>
      </div>
      <TooltipWrapper text={"Full screen"}>
        <Button
          onClick={toggleFullScreen}
          className={`${styles.controlBtn} ${styles.fullscreen}`}
        >
          {!!document.fullscreenElement ? (
            <FullscreenExit width={24} height={24} color="white" />
          ) : (
            <Fullscreen width={24} height={24} color="white" />
          )}
        </Button>
      </TooltipWrapper>
      <EndCallModal
        show={showEndModal}
        onConfirm={() => {
          leaveChannel("ENDED");
        }}
        onReject={() => setshowEndModal(false)}
      />
    </div>
  );
};
