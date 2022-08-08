import AgoraRTC, {
  ICameraVideoTrack,
  IRemoteVideoTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { FC, useEffect, useState } from "react";
import styles from "styles/Agora.module.scss";
export const AgoraVideoPlayer: FC<{
  id: number;
  track: ICameraVideoTrack | IRemoteVideoTrack | ILocalVideoTrack;
}> = ({ id, track }) => {
  const [aspectRatio, setAspectRatio] = useState("a4_3");

  useEffect(() => {
    if (!!track && !track?.isPlaying) track?.play(`frame-${id}`);

    if (!!track && track.isPlaying && track.getCurrentFrameData()) {
      const w = track.getCurrentFrameData().width;
      const h = track.getCurrentFrameData().height;
      const camFormat = w > h ? "HORIZONTAL" : "VERTICAL";
      const res = (w / h).toFixed(1);

      const horizontalAspectRatio: any = {
        "1.3": "a4_3",
        "1.7": "a16_9",
        "1.5": "a3_2",
        "2.3": "a21_9",
        "1.6": "a16_10",
      };
      const verticalAspectRatio: any = {
        "1.3": "a3_4",
        "1.5": "a2_3",
        "1.6": "a10_16",
        "1.7": "a9_16",
        "1.8": "a9_17",
        "2.0": "a9_18",
        "2.1": "a9_19",
        "2.2": "a9_20",
        "2.3": "a9_21",
        "2.4": "a9_22",
        "2.5": "a9_23",
      };
      if (camFormat === "HORIZONTAL")
        setAspectRatio(horizontalAspectRatio[res]);
      else if (camFormat === "VERTICAL")
        setAspectRatio(verticalAspectRatio[res]);
    }
  }, [track, id]);

  return (
    <div
      id={`frame-${id}`}
      className={`${styles.videoCardPlayer} ${styles[aspectRatio]}`}
    ></div>
  );
};
