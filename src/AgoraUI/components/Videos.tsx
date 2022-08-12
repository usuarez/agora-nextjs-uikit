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
    ) {
      let usersCount = Object.keys(users).length;
      setLayout(`grid-${usersCount}-p`);
    } else if (Object.keys(users).length > 0) {
      let usersCount = Object.keys(users).length;
      setLayout(`grid-${usersCount}`);
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
          {/**
 
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`${styles.videoCard}`}>
              <div className={styles.avatar}>
                <p className={styles.userInitial}>U{i}</p>
              </div>
            </div>
          ))}

 */}
          {Object.keys(users).length > 0 &&
            Object.keys(users)
              .filter((u) => Number(u) < 100000000000)
              .map((u) => {
                const remoteUser = users[u];
                console.log(remoteUser);
                return (
                  <VideoCard
                    key={remoteUser?.uid}
                    isRemote={true}
                    remoteVideoTrack={
                      (!!remoteUser && remoteUser!.videoTrack) || null
                    }
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};
