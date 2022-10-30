export const getRTCTokens = async (channelName: string) => {
  const uri =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://planner-bn04.onrender.com/api/meets/";
  let resData;
  await fetch(`${uri}${channelName}`, { method: "POST" }).then((res) => {
    return res.json().then((data) => {
      if (data?.uid) resData = data;
    });
  });
  console.log(resData);
  return resData;
};
