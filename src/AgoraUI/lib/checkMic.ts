import AgoraRTC from 'agora-rtc-sdk-ng'
// types
import { IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'
import { Dispatch, SetStateAction } from 'react'

export const checkMic = async (
  setmicTrack: Dispatch<
    SetStateAction<IMicrophoneAudioTrack | 'NOT_ALLOWED' | null>
  >
) => {
  await AgoraRTC.getMicrophones()
    .then((devices) => {
      AgoraRTC.createMicrophoneAudioTrack().then((mic) => {
        setmicTrack(mic)
      })
    })
    .catch((e) => {
      setmicTrack('NOT_ALLOWED')
    })
}
