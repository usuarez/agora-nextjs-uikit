import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import Image from "next/image";
import { FC } from "react";
import styles from "styles/Agora.module.scss";
import { ISessionUser } from "types/Agora";
import { AgoraVideoPlayer } from "./AgoraVideoPlayer";

interface IAgoraVideoCard {
  videoTrack?: ICameraVideoTrack | null;
  remoteVideoTrack?: IRemoteVideoTrack | null;
  isRemote?: boolean;
  user: ISessionUser;
}

export const VideoCard: FC<IAgoraVideoCard> = ({
  videoTrack = null,
  remoteVideoTrack = null,
  user,
}) => {
  const AvatarTemplate = () => {
    return (
      <div className={styles.avatar}>
        {!!user.profilePicture ? (
          <Image
            src={user.profilePicture}
            width={140}
            height={140}
            objectFit="cover"
            alt="user profile picture"
          />
        ) : (
          <p className={styles.userInitial}>
            {!!user && user?.name?.slice(0, 1)}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.videoCard}`}>
      {!!videoTrack && !videoTrack.muted && (
        <AgoraVideoPlayer id={user.id!} track={videoTrack!} />
      )}
      {!!remoteVideoTrack && (
        <AgoraVideoPlayer id={user.id!} track={remoteVideoTrack!} />
      )}

      {!remoteVideoTrack && !!videoTrack?.muted && AvatarTemplate()}
      {!remoteVideoTrack && !videoTrack && AvatarTemplate()}
    </div>
  );
};
