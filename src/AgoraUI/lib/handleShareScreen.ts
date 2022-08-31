import { IAgoraVideoSession } from "AgoraUI/context/agoraContext";
import { Dispatch, SetStateAction } from "react";

export const handleShareScreen: (
  sessionData: IAgoraVideoSession,
  setSessionData: Dispatch<SetStateAction<IAgoraVideoSession>>,
  handler: () => void,
  isPlaying: boolean
) => void = (sessionData, setSessionData, handler, isPlaying) => {
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
  if (isPlaying) handler();
};
