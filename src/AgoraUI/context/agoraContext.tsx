import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface IAgoraContext {
  sessionData: IAgoraVideoSession;
  setSessionData: Dispatch<SetStateAction<IAgoraVideoSession>>;
}
const initialValue = {
  token: "",
  screenToken: "",
  channel: "",
  uid: 0,
  inCall: false,
  inScreenCall: false,
  role: "COACH",
  status: "NOT_STARTED",
  users: {},
  localTrackState: {
    video: false,
    audio: false,
  },
  areTracksPublished: false,
};

const SessinContext: IAgoraVideoSession = {
  videoCall: {
    token: "",
    uid: 0,
    inCall: false,
    role: "COACH",
    status: "NOT_STARTED",
  },
  screenCall: {
    token: "",
    uid: 0, //+100k in local
    inCall: false,
    status: "NOT_STARTED",
  },
  channel: { name: "", users: {} },

  localTracks: {
    video: false,
    audio: false,
    areTracksPublished: false,
  },
};

export const agoraContext = createContext<{
  sessionData: IAgoraVideoSession;
  setSessionData: Dispatch<SetStateAction<IAgoraVideoSession>>;
}>({
  sessionData: SessinContext,
  setSessionData: (data) => {},
});

export const AgoraContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sessionData, setSessionData] = useState(SessinContext);

  return (
    <agoraContext.Provider
      value={{
        sessionData,
        setSessionData,
      }}
    >
      {children}
    </agoraContext.Provider>
  );
};

export interface RTCCall {
  uid?: number;
  token?: string;
  role?: "COACH" | "COACHEE" | string;
  inCall?: boolean;
  status?:
    | "NOT_STARTED"
    | "INCALL"
    | "ENDED"
    | "LOSS"
    | "UNAUTH"
    | "LEAVING"
    | string;
}
export interface IAgoraVideoSession {
  videoCall: RTCCall;
  screenCall: RTCCall;
  channel: {
    name?: string;
    users: {
      [key: string]: IAgoraRTCRemoteUser | null;
    };
    remoteScreen?: boolean;
    localScreen?: boolean;
  };

  localTracks?: {
    video?: boolean;
    audio?: boolean;
    areTracksPublished?: boolean;
  };
}
