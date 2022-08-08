import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import Image from "next/image";
import { FC } from "react";
import styles from "styles/Agora.module.scss";
import { AgoraVideoPlayer } from "./AgoraVideoPlayer";

interface IAgoraVideoCard {
  videoTrack?: ICameraVideoTrack | null;
  remoteVideoTrack?: IRemoteVideoTrack | null;
  isRemote?: boolean;
}

export const VideoCard: FC<IAgoraVideoCard> = ({
  videoTrack = null,
  remoteVideoTrack = null,
}) => {
  const AvatarTemplate = () => {
    return (
      <div className={styles.avatar}>
        <p className={styles.userInitial}>U</p>
      </div>
    );
  };

  return (
    <div className={`${styles.videoCard}`}>
      {!!videoTrack && !videoTrack.muted && (
        <AgoraVideoPlayer id={Math.random()} track={videoTrack!} />
      )}
      {!!remoteVideoTrack && (
        <AgoraVideoPlayer id={Math.random()} track={remoteVideoTrack!} />
      )}

      {!remoteVideoTrack && !!videoTrack?.muted && AvatarTemplate()}
      {!remoteVideoTrack && !videoTrack && AvatarTemplate()}
    </div>
  );
};
