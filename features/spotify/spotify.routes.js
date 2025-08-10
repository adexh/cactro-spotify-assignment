import { Router } from "express";

import controller from "features/spotify/spotify.controller.js";

const router = Router();

router.get('/artists-followed', controller.getArtistsFollowed);
router.get('/play', controller.playSong);
router.get('/top-tracks', controller.getTopTracks);
router.get('/play-top', controller.playTopSong);
router.get('/pause', controller.pausePlayback);
router.get('/current-playback', controller.getCurrentPlayback);
router.get('/currently-playing', controller.getCurrentlyPlaying);
router.get('/devices', controller.getAvailableDevices);
router.get('/openapi.json', controller.getOpenApiSpec);

export default router;
