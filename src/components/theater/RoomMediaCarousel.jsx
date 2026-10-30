import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const total = mediaList.length;
  const currentMedia = total > 0 ? mediaList[currentIndex % total] : null;

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

  // Handle Playback & Transitions
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!currentMedia || total <= 1) return;

    if (currentMedia.mediaType === 'image') {
      const durationMs = (currentMedia.duration || 4) * 1000;
      timerRef.current = setTimeout(() => {
        advanceNext();
      }, durationMs);
    } else if (currentMedia.mediaType === 'video') {
      const vid = videoRef.current;
      if (vid) {
        vid.currentTime = 0;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy prevented playback, fall back to timer so carousel doesn't get stuck
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
  }, [currentIndex, currentMedia, total]);

  const advanceNext = () => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const advancePrev = () => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 400);
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
      {/* Active Media Container with Smooth Fade Transition */}
      <div
        className={`h-full w-full transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-80' : 'opacity-100'
        }`}
      >
        {currentMedia.mediaType === 'video' ? (
          <video
            ref={videoRef}
            key={currentMedia.url}
            src={currentMedia.url}
            muted
            playsInline
            autoPlay
            controls={false}
            preload="metadata"
            onEnded={handleVideoEnded}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <img
            key={currentMedia.url}
            src={currentMedia.url}
            alt={room?.name || 'Room media'}
            onError={handleImageError}
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>

      {/* Media Type & Counter Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="rounded-full bg-black/65 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
          {currentMedia.mediaType === 'video' ? (
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
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:scale-105 active:scale-95 shadow-md"
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
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/75 hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Carousel Indicators / Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm pointer-events-none">
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

