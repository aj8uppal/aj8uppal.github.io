# Rift Clash on Pages and Fly

`https://aj8uppal.github.io/rift-clash/` is a static build of Rift Clash. Local
play, training and CPU matches need nothing else. Online play connects to the
lobby server at `wss://rift-clash.fly.dev/signal` (Fly app `rift-clash`, one
always-on machine in `iad`; autostop is off because it stopped a live relay match). Players connect peer to peer over WebRTC
when they can, and relay match packets through that server when they can't. A directly connected match keeps running if the lobby server
goes away; a relayed one ends with a message.

The game source lives outside this repo. Build and deploy both halves from the
same checkout:

    npm test                     # simulation, combat, netcode, frame data
    fly deploy --ha=false        # lobby server + a copy of the client at the Fly root
    npm run build:pages          # client pointed at the Fly lobby, into dist-pages/
    # then replace public/rift-clash/ with dist-pages/ and the licenses/ folder

Keep the Fly app at one machine: rooms live in memory, so a second machine would
split the lobby. `public/rift-clash/release.json` records the build hash. It is
derived from the simulation and netcode sources, and the lobby server only lets
players with the same hash share a room. Rebuild both halves whenever gameplay
code changes, or the Pages client and anyone on the Fly-hosted copy stop
matching.
