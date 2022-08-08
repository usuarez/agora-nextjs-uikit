export interface VideoCallProps {
  uid: number;
  role: string | "Coach" | "Coachee";
  token: string;
  screenToken: string;
  channel: string;
  localTrackState?: {
    video: boolean;
    audio: boolean;
  };
  areTracksPublished?: boolean;
}
