import { useContext, useEffect, useState } from "react";

import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { agoraContext } from "../context/agoraContext";

import styles from "styles/Agora.module.scss";

import { VideoCard } from "./VideoCard";
import { AgoraVideoPlayer } from "./AgoraVideoPlayer";

export const Videos = (props: {
  localVideo: ICameraVideoTrack | null;
  localScreenTrack: ILocalVideoTrack | null;
}) => {
  const { sessionData } = useContext(agoraContext);
  const { users } = sessionData.channel;
  const { localVideo, localScreenTrack } = props;
  const [layout, setLayout] = useState("alone");
  const [remoteUserTrack, setRemoteUserTrack] = useState<{
    [key: string]: IAgoraRTCRemoteUser | null;
  } | null>({});
  const [remoteScreenTrack, setRemoteScreenTrack] = useState<{
    [key: string]: IAgoraRTCRemoteUser | null;
  } | null>({});

  useEffect(() => {
    //set remote user tracks
    const remoteUIDVideo = Object.keys(users).find(
      (u) => Number(u) < 100000000000
    );

    if (Object.keys(users).length > 0 && !!remoteUIDVideo) {
      setRemoteUserTrack({
        [remoteUIDVideo]: users[remoteUIDVideo] as IAgoraRTCRemoteUser,
      });
    } else setRemoteUserTrack(null);

    //set remote screen
    const remoteScreenUID = Object.keys(users).find(
      (u) => Number(u) > 100000000000
    );

    if (
      Object.keys(users).length > 0 &&
      Number(remoteScreenUID) !==
        Number(sessionData.videoCall.uid) + 100000000000
    ) {
      setRemoteScreenTrack({
        [remoteScreenUID!]: users[remoteScreenUID!] as IAgoraRTCRemoteUser,
      });
    } else setRemoteScreenTrack(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(users).length, users]);

  //set layout
  useEffect(() => {
    if (
      (!!remoteScreenTrack &&
        !!remoteScreenTrack![Object.keys(remoteScreenTrack!)[0]]) ||
      !!localScreenTrack
    )
      setLayout("pinnedScreen");
    else if (Object.keys(users).length > 0) {
      setLayout("basic");
    } else {
      setLayout("alone");
    }
  }, [
    Object.keys(users).length,
    localScreenTrack,
    remoteUserTrack,
    localVideo,
    users,
    remoteScreenTrack,
  ]);

  /**
   * Layout classes
   * .alone = local user alone
   * .basic = 2 or 3 participants, centred cards in one row
   * .grid = 4 participants, 2rows 2cards per row
   * .column = x participants in a column
   */

  return (
    <div>
      <div id={styles.videos} className={`${styles[layout]} `}>
        {Object.keys(users).length > 0 &&
          !!Object.keys(users).find((u) => Number(u) > 100000000000) &&
          !!remoteScreenTrack && (
            <div className={styles.pinned}>
              <AgoraVideoPlayer
                id={Math.floor(Math.random() * 100)}
                track={
                  remoteScreenTrack![Object.keys(remoteScreenTrack!)[0]]
                    ?.videoTrack!
                }
              />
            </div>
          )}
        {!!localScreenTrack && sessionData.screenCall.status !== "ENDED" && (
          <div className={styles.pinned}>
            <AgoraVideoPlayer
              id={Math.floor(Math.random() * 10000)}
              track={localScreenTrack!}
            />
          </div>
        )}
        <div className={styles.cardsContainer}>
          <VideoCard videoTrack={!!localVideo ? localVideo! : null} />
          {Object.keys(users).length > 0 &&
            !!remoteUserTrack &&
            !!Object.keys(users).find((u) => Number(u) < 100000000000) && (
              <VideoCard
                isRemote={true}
                remoteVideoTrack={
                  (!!remoteUserTrack![Object.keys(remoteUserTrack!)[0]]! &&
                    remoteUserTrack![Object.keys(remoteUserTrack!)[0]]!
                      .videoTrack!) ||
                  null
                }
              />
            )}
        </div>
      </div>
    </div>
  );
};
