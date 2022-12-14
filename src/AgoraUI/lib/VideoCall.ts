// types
import {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { Dispatch, SetStateAction } from "react";
import { IAgoraVideoSession } from "../context/agoraContext";

interface VideoCallInitProps {
  appId: string;
  sessionData: IAgoraVideoSession;
  setSessionData: Dispatch<SetStateAction<IAgoraVideoSession>>;
  microphoneTrack: IMicrophoneAudioTrack | "NOT_ALLOWED" | null;
  cameraTrack: ICameraVideoTrack | "NOT_ALLOWED" | null;
  client: IAgoraRTCClient;
}
export const VideoCallInit = async (data: VideoCallInitProps) => {
  const {
    appId,
    sessionData,
    setSessionData,
    microphoneTrack,
    cameraTrack,
    client,
  } = data;
  const { uid, token, inCall } = sessionData.videoCall;

  client!.on("user-published", async (user, mediaType) => {
    //this validation also fix the extra minutes in the audio
    if (
      Number(user.uid) !== Number(uid) &&
      Number(user.uid) - 100000 !== Number(uid)
    ) {
      await client!.subscribe(user, mediaType);
      //validation to add only one user to remote tracks
      setSessionData((pr) => {
        return {
          ...pr,
          channel: {
            ...pr.channel,
            users: { ...pr.channel?.users!, [user.uid.toString()]: user },
          },
        };
      });
      if (mediaType === "audio") user.audioTrack?.play();
    }
  });

  //when an user mute any media this event is triggered, we use it for mute handling
  client!.on("user-unpublished", (user, type) => {
    if (type === "audio") {
      user.audioTrack?.stop();
    }
    if (type === "video") {
      setSessionData((pr) => {
        return {
          ...pr,
          channel: {
            ...pr.channel,
            users: { ...pr.channel?.users!, [user.uid]: null },
          },
        };
      });
    }
  });
  //when an user leaves the session we need delete from the remote tracks
  client!.on("user-left", (user) => {
    setSessionData((pr) => {
      const usersCopy = pr.channel?.users!;
      delete usersCopy[user.uid.toString()];
      return {
        ...pr,
        channel: {
          ...pr.channel,
          users: usersCopy,
        },
      };
    });
  });

  client!.on("user-joined", (user) => {
    setSessionData((pr) => {
      return {
        ...pr,
        channel: {
          ...pr.channel,
          users: { ...pr.channel?.users!, [user.uid]: null },
        },
      };
    });
  });
  if (
    !["CONNECTED", "CONNECTING"].includes(client!.connectionState) &&
    inCall
  ) {
    //user login event, last param is uid as string | int
    await client!.join(appId, sessionData.channel?.name!, token!, uid);

    if (
      !!microphoneTrack &&
      !!cameraTrack &&
      microphoneTrack !== "NOT_ALLOWED" &&
      cameraTrack !== "NOT_ALLOWED"
    ) {
      await client!.publish([microphoneTrack!, cameraTrack!]);
      console.log("publish audio y video");
    } else if (!!microphoneTrack && microphoneTrack !== "NOT_ALLOWED") {
      console.log("publish audio");
      await client!.publish([microphoneTrack!]);
    } else if (!!cameraTrack && cameraTrack !== "NOT_ALLOWED") {
      console.log("publish video");
      await client!.publish([cameraTrack!]);
    } else {
      console.log("i think that this user can not participate");
    }
    setSessionData({
      ...sessionData,
      localTracks: {
        ...sessionData.localTracks,
        areTracksPublished: true,
      },
    });
  }
};
