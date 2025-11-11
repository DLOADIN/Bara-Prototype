import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { InteractiveEventsMap } from './InteractiveEventsMap';

interface EventMarkerData {
  id: string;
  title: string;
  description?: string;
  venue: string;
  latitude: number;
  longitude: number;
  event_date: string;
  image_url?: string;
  city?: string;
}

interface FullscreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventMarkerData[];
  selectedEventId?: string;
  title?: string;
}

export const FullscreenMapModal: React.FC<FullscreenMapModalProps> = ({
  isOpen,
  onClose,
  events,
  selectedEventId,
  title = 'Events Map',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0">
        <div className="h-full w-full relative">
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg px-4 py-2">
            <h2 className="font-bold text-lg">{title}</h2>
          </div>
          <InteractiveEventsMap
            events={events}
            selectedEventId={selectedEventId}
            height="100%"
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
