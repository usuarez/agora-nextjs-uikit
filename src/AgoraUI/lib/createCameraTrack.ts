import AgoraRTC from "agora-rtc-sdk-ng";
// types
import { ICameraVideoTrack } from "agora-rtc-sdk-ng";
import { Dispatch, SetStateAction } from "react";

export const createCameraTrack = async (
  setCameraTrack: Dispatch<
    SetStateAction<ICameraVideoTrack | "NOT_ALLOWED" | null>
  >
) => {
  await AgoraRTC.getCameras()
    .then((devices) => {
      AgoraRTC.createCameraVideoTrack().then((cam) => {
        setCameraTrack(cam);
      });
    })
    .catch((e) => {
      setCameraTrack("NOT_ALLOWED");
    });
};
