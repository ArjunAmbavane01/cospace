const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

export const peerConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:standard.relay.metered.ca:80",
      username: turnUsername,
      credential: turnCredential,
    },
    {
      urls: "turn:standard.relay.metered.ca:80?transport=tcp",
      username: turnUsername,
      credential: turnCredential,
    },
    {
      urls: "turn:standard.relay.metered.ca:443",
      username: turnUsername,
      credential: turnCredential,
    },
    {
      urls: "turns:standard.relay.metered.ca:443?transport=tcp",
      username: turnUsername,
      credential: turnCredential,
    },
  ],
};