import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  category?: string;
}

export const EventCard = ({
  id,
  title,
  date,
  time,
  location,
  imageUrl,
  category,
}: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        <img
          src={imageUrl || 'https://via.placeholder.com/400x300?text=Event+Image'}
          alt={title}
          className="w-full h-full object-cover"
        />
        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 h-14">
          {title}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span>{date} • {time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/events/${id}`;
            }}
            className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            View Event
          </button>
        </div>
      </div>
    </div>
  );
};
