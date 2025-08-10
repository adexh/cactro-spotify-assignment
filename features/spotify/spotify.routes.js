import { Router } from "express";

import controller from "features/spotify/spotify.controller.js";

const router = Router();

router.get('/artists-followed', controller.getArtistsFollowed);
router.put('/play', controller.playSong);
router.get('/top-tracks', controller.getTopTracks);
router.put('/play-top', controller.playTopSong);
router.put('/pause', controller.pausePlayback);
router.get('/current-playback', controller.getCurrentPlayback);
router.get('/currently-playing', controller.getCurrentlyPlaying);

export default router;
