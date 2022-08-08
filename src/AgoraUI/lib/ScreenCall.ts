import AgoraRTC from 'agora-rtc-sdk-ng'
import { IAgoraRTCClient, ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import { Dispatch, SetStateAction } from 'react'
import { IAgoraVideoSession, RTCCall } from '../context/agoraContext'

//start the call
export const startScreenCall = async (data: {
  appId: string
  sessionData: IAgoraVideoSession
  setSessionData: Dispatch<SetStateAction<IAgoraVideoSession>>
  screenTrack: ILocalVideoTrack
  setScreenTrack: Dispatch<SetStateAction<ILocalVideoTrack | null>>
  client: IAgoraRTCClient
}) => {
  const {
    appId,
    sessionData,
    setSessionData,
    screenTrack,
    setScreenTrack,
    client,
  } = data
  const { token, uid, inCall, status } = sessionData?.screenCall!

  const init = async () => {
    console.log('//////////////////////////////')
    console.log('//////////////////////////////')
    console.log('starting screenCall')
    console.log(client!.connectionState)
    console.log('//////////////////////////////')
    console.log('//////////////////////////////')

    console.log('//////////////////////////////')
    console.log('//////////////////////////////')
    console.log('starting Jooooooin')
    console.log(appId, sessionData.channel?.name!, token!, Number(uid))
    console.log('//////////////////////////////')
    try {
      await client!.join(appId, sessionData.channel?.name!, token!, Number(uid))

      if (!!screenTrack) {
        await client!.publish(screenTrack).then(() => {
          console.log('//////////////////////////////')
          console.log('//////////////////////////////')
          console.log('screen published')
          console.log('//////////////////////////////')
          console.log('//////////////////////////////')
        })
      }
    } catch (err) {
      console.log(err)
      /**
         * 
         setSessionData((pr) => {
           return {
             ...pr,
             screenCall: {
               ...pr.screenCall,
               inCall: false,
               status: 'LOSS',
             },
           }
         })
         */
    }
  }
  if (
    !!client &&
    !['CONNECTED', 'CONNECTING'].includes(client!.connectionState) &&
    inCall
  ) {
    init()
  } else if (!!client) {
    client.leave().then(() => {
      init()
    })
  }
}
