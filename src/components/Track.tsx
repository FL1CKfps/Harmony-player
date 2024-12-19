interface TrackProps {
  track: Track;
}

const Track: React.FC<TrackProps> = ({ track }) => {
  return (
    <img 
      src={track.albumArt} 
      alt={track.name}
      className="w-full h-full object-cover rounded-lg"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.src = 'https://placehold.co/400x400?text=No+Image';
      }}
    />
  );
};

export default Track; 