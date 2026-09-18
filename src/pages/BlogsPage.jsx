import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { ImagePreviewModal } from '../components/common/ImagePreviewModal';
import { motion } from 'framer-motion';

export function BlogsPage() {
  const [previewImage, setPreviewImage] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: contentService.getStories,
  });

  const stories = response?.data || [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-5 max-w-[1440px] mx-auto">
      <h1 className="text-4xl font-heading font-black text-[#181533] mb-8 text-center">Our Stories & Blogs</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Read the latest news, stories, and blogs from our community.</p>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="h-48 bg-gray-200 animate-pulse"></div>
               <div className="p-6">
                 <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                 <div className="h-4 w-full bg-gray-100 rounded mb-2 animate-pulse"></div>
                 <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={story._id} 
              className="bg-white rounded-xl shadow-sm border border-[#f0e6dd] overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div 
                className="h-56 w-full overflow-hidden cursor-pointer relative group"
                onClick={() => setPreviewImage(story.image)}
              >
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full transition-opacity shadow-sm">
                    Preview Image
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="font-medium text-[#8c5211]">{story.author}</span>
                  <span>{new Date(story.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-bold text-[#181533] mb-3 leading-tight">{story.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap">{story.content}</p>
              </div>
            </motion.div>
          ))}
          {stories.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500">
               No stories published yet. Check back soon!
             </div>
          )}
        </div>
      )}

      <ImagePreviewModal 
        isOpen={!!previewImage} 
        imageUrl={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />
    </div>
  );
}
