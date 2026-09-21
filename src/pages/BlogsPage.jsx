import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function BlogsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: contentService.getStories,
  });

  const stories = response?.data || [];

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 max-w-[1440px] relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-[#c2a290]"></div>
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#9e6223]">
              OUR STORIES
            </span>
            <div className="h-[1px] w-12 bg-[#c2a290]"></div>
          </div>
          
          <h1 className="text-[40px] md:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
            RIO PARTY HOUSE – <span className="text-[#a54c13]">Blogs</span>
          </h1>
          
          <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] max-w-2xl leading-[1.6]">
            Read the latest news, stories, and editorial features from our community.
          </p>
        </div>
      
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="h-56 bg-gray-200 animate-pulse"></div>
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
              <Link to={`/blogs/${story._id}`} key={story._id}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-white overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-shadow flex flex-col h-full group"
                >
                  <div className="h-56 w-full overflow-hidden relative">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1 bg-white">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-wider">
                      <span className="text-[#8c5211]">{story.author}</span>
                      <span>{new Date(story.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-[#1a1c21] mb-3 leading-tight group-hover:text-[#a54c13] transition-colors">{story.title}</h3>
                    <p className="text-[#6b5c52] text-[14px] leading-relaxed line-clamp-3 mb-6 flex-1 font-medium">
                      {story.shortDescription || story.content}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#8c5211] group-hover:text-[#a54c13]">
                        Read Story
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
            {stories.length === 0 && (
               <div className="col-span-full text-center py-20 text-[#6b5c52] font-medium text-lg bg-white rounded-[32px] shadow-sm border border-[#f0e6dd]">
                 No stories published yet. Check back soon!
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
