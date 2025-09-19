import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

export const EventCard = ({
  id,
  title,
  date,
  time,
  location,
  imageUrl,
}: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl || 'https://via.placeholder.com/400x300?text=Event+Image'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
          {title}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-brand-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{date} • {time}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-brand-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/events/${id}`;
            }}
            className="w-full text-center bg-brand-blue hover:bg-brand-blue-hover text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            View Event
          </button>
        </div>
      </div>
    </div>
  );
};
