import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { ContentItem } from '../../types/api';
import ContentCard from './ContentCard';

interface DraggableContentCardProps {
  item: ContentItem;
  index: number;
  isDragDisabled?: boolean;
}

const DraggableContentCard: React.FC<DraggableContentCardProps> = ({ 
  item, 
  index, 
  isDragDisabled = false 
}) => {
  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          layout
          className={`relative group ${snapshot.isDragging ? 'z-50' : ''}`}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? provided.draggableProps.style?.transform 
              : 'none',
          }}
        >
          {/* Drag Handle */}
          {!isDragDisabled && (
            <div
              {...provided.dragHandleProps}
              className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          )}

          {/* Content Card with Drag Styling */}
          <div
            className={`transition-all duration-200 ${
              snapshot.isDragging
                ? 'rotate-3 scale-105 shadow-2xl ring-2 ring-blue-500 ring-opacity-50'
                : 'hover:shadow-lg'
            }`}
          >
            <ContentCard item={item} />
          </div>

          {/* Drag Overlay Effect */}
          {snapshot.isDragging && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl pointer-events-none" />
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default DraggableContentCard;