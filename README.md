This is a Typescript [Next.js](https://nextjs.org/) project created to learn and teach how to use AgoraRTC.

## Getting Started

First, instal deps, we use `react-bootstrap, react-bootstrap-icons, sass, agora-rtc-sdk-ng` in this project

```bash
npm install
# or
yarn
```

now you can run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Demo

[You can try the demo here](https://agora-nextjs-uikit.vercel.app)

## Knowing the UIKit

First, the Agora logic is located in the AgoraUI folder

```
AgoraUI/
-components/
--AgoraVideoPlayer.tsx  --> calc video size and render in the videoCard
--Controls.tsx          --> basic call controls
--EndCallModal.tsx      --> confirmation modal
--InviteWidget.tsx      --> Widget that help you to copy the link
--VideoCall.tsx         --> responsible of managing when the call starts or ends
--VideoCard.tsx	        --> Card that render the video or an avatar if video is muted
--Videos.tsx            --> Videos wrapper and layout logic, supports up to 10 users
--WaitingRoom.tsx       --> Area to check your camera before start the call
-context
--AgoraContext.tsx      --> Required data of the app
-lib/
--copyToClipboard.ts    --> A function to copy to clipboard easyly
--CreateCameraTrack.ts  --> a custom function to safely create camera tracks
--CreateMicrophoneTrack.ts --> a custom function to safely create mic tracks
--handleShareScreen.ts  --> Logic to handle when screenshare is starting or ending
--ScreenCall.ts         --> AgoraRTC logic to execute a call
--VideoCall.ts          --> AgoraRTC logic to execute a call (more detailed)
-index.tsx              --> Main wrapper

Styles are placed in the nextjs styles folder as "Agora.module.scss"
```



## Environment variables

Create a .env file in the root project and add the vars.

```
NEXT_PUBLIC_BACKEND_URL=Your token server endpoint
NEXT_PUBLIC_PUBLIC_AGORA_ID=Your agora id
NEXT_PUBLIC_DOMAIN=https://agora-nextjs-uikit.vercel.app
```



### Differences of this UiKit between the Agora official UiKit or the  Agora docs tutorials

#### 1. Safe Tracks creation

Agora docs suggest the use of the [createMicrophoneAndCameraTracks](https://api-ref.agora.io/en/video-sdk/web/4.x/interfaces/iagorartc.html#createmicrophoneandcameratracks) method but if the user deny the cam or mic access or if doesn't has a camera then an exception is throw. To fix it i wrote two small functions (`createMicrophoneTrack` and `createCameraTrack`) that are invoked after verify that we can use the user devices

Getting user devices

```
  //Using the enumerateDevices() method we can know if the user allow the web to use mic and camera devices
  
useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((data) => setavailableDevices(data.map((dev) => dev.kind)));
      
    availableDevices.length > 0 && createTracks();
    
  }, [availableDevices.length]);
  
  
//Validation to create tracks
const createTracks = async () => {
    if (availableDevices.length > 0) {
      if (availableDevices.includes("audioinput"))
        await createMicrophoneTrack(setMicrophoneTrack);
      else setMicrophoneTrack("NOT_ALLOWED");

      if (availableDevices.includes("videoinput"))
        await createCameraTrack(setCameraTrack);
      else setCameraTrack("NOT_ALLOWED");
    }
  };
  
//the setMicrophoneTrack and setCameraTrack are setState actions

setCameraTrack:Dispatch<SetStateAction<ICameraVideoTrack | "NOT_ALLOWED" | null>>
setmicTrack: Dispatch<SetStateAction<IMicrophoneAudioTrack | "NOT_ALLOWED" | null>>


```



#### 2. Better tracks handling

There are some things that agora don't explain clearly, first you can subscribe to your own tracks and it is a prblem charged to your bill, so we need prevent to subscriptions to our own tracks to save money, a simple  and effective validation is declared in the `src/AgoraUI/lib/VideoCall.ts`

```
client!.on("user-published", async (user, mediaType) => {
if (
      Number(user.uid) !== Number(uid) &&
      Number(user.uid) !== Number(screenId)
    ) {
    //we can subscribe to the tracks
    }
}
```





#### 3. Screen calls

I don't know if  the actual version of the agora-react-uikit provides this feature but in the tutorial docs it can be hard to implement because  they provide the examples but don't specify that you need to create a new client with a diferent id and start a new call to share the screen.







If you need implement the `agora-rtc-sdk-ng` i am happy to help 

usuarez.dev@gmail.com



