import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Clapperboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, handleImageError, DEFAULT_PLACEHOLDER } from '../../utils/imageUtils';

export function RoomMediaCarousel({ room, className = '' }) {
  // Normalize media items: prioritize room.media, fallback to room.image / room.galleryImages
  const mediaList = useMemo(() => {
    if (room?.media && Array.isArray(room.media) && room.media.length > 0) {
      return [...room.media]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item, idx) => ({
          id: item.mediaId || item._id || idx,
          mediaType: item.mediaType || 'image',
          url: getImageUrl(item.url),
          originalName: item.originalName || '',
          duration: item.duration || (item.mediaType === 'video' ? 0 : 4),
        }))
        .filter((item) => Boolean(item.url));
    }

    const legacyImages = [room?.image, ...(room?.galleryImages || [])]
      .filter(Boolean)
      .map((img) => getImageUrl(img))
      .filter(Boolean);

    // De-duplicate
    const seen = new Set();
    const unique = legacyImages.filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });

    return unique.map((url, idx) => ({
      id: `legacy_${idx}`,
      mediaType: 'image',
      url,
      originalName: `Image ${idx + 1}`,
      duration: 4,
    }));
  }, [room?.media, room?.image, room?.galleryImages]);

  // Compute a reliable fallback preview image from the room
  const fallbackPreviewImage = useMemo(() => {
    if (room?.image) {
      const url = getImageUrl(room.image);
      if (url) return url;
    }
    const firstImgMedia = mediaList.find((m) => m.mediaType === 'image');
    if (firstImgMedia?.url) return firstImgMedia.url;
    if (room?.galleryImages && room.galleryImages.length > 0) {
      const url = getImageUrl(room.galleryImages[0]);
      if (url) return url;
    }
    return DEFAULT_PLACEHOLDER;
  }, [room?.image, room?.galleryImages, mediaList]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoHasError, setVideoHasError] = useState(false);

  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const total = mediaList.length;
  const currentMedia = total > 0 ? mediaList[currentIndex % total] : null;

  // Track video loading state whenever the active media changes
  useEffect(() => {
    if (currentMedia?.mediaType === 'video') {
      setIsVideoLoading(true);
      setVideoHasError(false);
    } else {
      setIsVideoLoading(false);
      setVideoHasError(false);
    }
  }, [currentIndex, currentMedia?.mediaType, currentMedia?.url]);

  const advanceNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const advancePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  // Preload next image if applicable
  useEffect(() => {
    if (total <= 1) return;
    const nextIdx = (currentIndex + 1) % total;
    const nextItem = mediaList[nextIdx];
    if (nextItem && nextItem.mediaType === 'image' && nextItem.url) {
      const img = new Image();
      img.src = nextItem.url;
    }
  }, [currentIndex, mediaList, total]);

  // Handle Playback & Automatic Timing
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!currentMedia || total <= 1) return;

    // If current media is an image or video failed, move after display duration (default 4 seconds)
    if (currentMedia.mediaType === 'image' || videoHasError) {
      const durationMs = (currentMedia.duration || 4) * 1000;
      timerRef.current = setTimeout(() => {
        advanceNext();
      }, durationMs);
    } else if (currentMedia.mediaType === 'video' && !videoHasError) {
      const vid = videoRef.current;
      if (vid) {
        // If the video is already ready or playing, attempt to play
        vid.currentTime = 0;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsVideoLoading(false);
            })
            .catch(() => {
              // If browser autoplay policy or decode fails, fall back to timer so carousel doesn't get stuck
              setIsVideoLoading(false);
              timerRef.current = setTimeout(() => {
                advanceNext();
              }, 6000);
            });
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentIndex, currentMedia, total, videoHasError, advanceNext]);

  const handleVideoLoadedData = () => {
    setIsVideoLoading(false);
    const vid = videoRef.current;
    if (vid) {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay block fallback handled in effect
        });
      }
    }
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoHasError(true);
    // Advance after standard image duration on error so it doesn't get stuck
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      advanceNext();
    }, 4000);
  };

  const handleVideoEnded = () => {
    advanceNext();
  };

  if (!total || !currentMedia) {
    return (
      <div className={`relative h-[190px] w-full overflow-hidden bg-[#eadfce] flex items-center justify-center text-xs text-[#8d7a6c] ${className}`}>
        Room media unavailable
      </div>
    );
  }

  return (
    <div className={`relative h-[190px] w-full overflow-hidden bg-[#1e1c29] select-none ${className}`}>
      {/* Media item rendering with smooth fade transitions */}
      <div className="relative h-full w-full">
        {currentMedia.mediaType === 'video' && !videoHasError ? (
          <>
            {/* 1. Underlying Room Preview Image (guarantees no dark or blank screen while video buffers/loads) */}
            <img
              src={fallbackPreviewImage}
              alt={room?.name || 'Room preview'}
              onError={handleImageError}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* 2. Video Player with smooth fade-in once ready */}
            <video
              ref={videoRef}
              key={currentMedia.url}
              src={currentMedia.url}
              muted
              playsInline
              autoPlay
              controls={false}
              preload="auto"
              onLoadedData={handleVideoLoadedData}
              onPlaying={() => setIsVideoLoading(false)}
              onWaiting={() => setIsVideoLoading(true)}
              onError={handleVideoError}
              onEnded={handleVideoEnded}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
                isVideoLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* 3. Premium Rio Party House Cinema Loading Animation Overlay */}
            <AnimatePresence>
              {isVideoLoading && (
                <motion.div
                  key="video-loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px] text-white"
                >
                  <div className="relative flex items-center justify-center mb-2">
                    {/* Subtle gold glow pulse */}
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.7, 0.35] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-11 h-11 rounded-full bg-[#dfb26a]/30 -z-0"
                    />
                    {/* Bouncing Cinema Screen / Clapperboard badge */}
                    <motion.div
                      animate={{ y: [0, -3.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10 w-9 h-9 rounded-xl bg-gradient-to-br from-[#2c2016] to-[#1a130d] border border-[#dfb26a]/60 shadow-lg flex items-center justify-center text-[#fbd78b]"
                    >
                      <Clapperboard className="w-4 h-4 text-[#fbd78b]" />
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11.5px] font-semibold tracking-wider text-[#fdecd2] drop-shadow-sm">
                      Loading video...
                    </span>
                    <div className="flex items-center gap-1 pt-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.2, 0.8] }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            delay: i * 0.18,
                            ease: 'easeInOut',
                          }}
                          className="w-1 h-1 rounded-full bg-[#dfb26a]"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Image slide (or video fallback if error) */
          <img
            key={currentMedia.url}
            src={videoHasError ? fallbackPreviewImage : currentMedia.url}
            alt={room?.name || 'Room media'}
            onError={handleImageError}
            className="h-full w-full object-cover object-center animate-fade-in transition-opacity duration-500"
          />
        )}
      </div>

      {/* Media Type & Counter Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
        <span className="rounded-full bg-black/65 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
          {currentMedia.mediaType === 'video' && !videoHasError ? (
            <>
              <Play className="h-2.5 w-2.5 fill-white" />
              <span>Video ({currentIndex + 1}/{total})</span>
            </>
          ) : (
            <span>{currentIndex + 1} / {total}</span>
          )}
        </span>
      </div>

      {/* Manual Controls (Chevron Left / Right) */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous room media"
            onClick={(e) => {
              e.stopPropagation();
              advancePrev();
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next room media"
            onClick={(e) => {
              e.stopPropagation();
              advanceNext();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Carousel Indicators / Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm pointer-events-none">
            {mediaList.map((item, idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'h-1.5 w-3.5 bg-white shadow-sm'
                    : 'h-1.5 w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

