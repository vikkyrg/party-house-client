import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function StoryDetailPage() {
  const { id } = useParams();

  const { data: response, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: contentService.getStories,
  });

  const stories = response?.data || [];
  const story = stories.find(s => s._id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 flex justify-center">
        <div className="animate-pulse flex flex-col items-center w-full max-w-4xl px-5">
          <div className="h-10 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="h-[400px] w-full bg-gray-200 rounded-[24px] mb-10"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 flex flex-col items-center justify-center font-sans px-5 text-center">
        <h1 className="text-4xl font-heading font-extrabold text-[#1a1c21] mb-4">Story Not Found</h1>
        <p className="text-[#6b5c52] mb-8 font-medium">We couldn't find the story you're looking for.</p>
        <Link to="/blogs" className="px-8 py-3 bg-[#8c5211] text-white rounded-full font-bold hover:bg-[#a54c13] transition-colors shadow-md">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-28 pb-24 relative overflow-hidden font-sans">
      {/* Background SVG Decors */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-5 sm:px-10 lg:px-20 max-w-[1200px] relative z-10">
        
        {/* Back Link */}
        <Link to="/blogs" className="inline-flex items-center gap-2 text-[#8c5211] font-bold text-sm mb-12 hover:text-[#a54c13] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all stories
        </Link>

        {/* Editorial Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-[#c2a290]"></div>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">
              FEATURED STORY
            </span>
          </div>
          
          <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-6 max-w-4xl">
            {story.title}
          </h1>

          {story.shortDescription && (
            <p className="text-[18px] md:text-[22px] font-medium text-[#6b5c52] leading-[1.6] max-w-3xl mb-8">
              {story.shortDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-[13px] font-bold uppercase tracking-wider text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f0e6dd] flex items-center justify-center text-[#8c5211] font-heading font-black">
                {story.author ? story.author.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-[#1a1c21]">{story.author}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-[#c2a290]"></div>
            <span>{new Date(story.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-4 border-white mb-20 relative">
            <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-24 md:space-y-32">
          
          {(!story.sections || story.sections.length === 0) && story.content && (
            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-p:text-[#4a403a] prose-p:leading-[1.8]">
              <p className="whitespace-pre-wrap">{story.content}</p>
            </div>
          )}

          {story.sections && story.sections.map((section, index) => {
            const hasImage = !!section.image;
            const isEven = index % 2 === 0;

            if (!hasImage) {
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
                  key={index} 
                  className="max-w-3xl mx-auto text-center"
                >
                  <div className="mb-4 text-[#c2a290] font-heading font-black text-6xl opacity-30">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-3xl font-heading font-extrabold text-[#1a1c21] mb-6">{section.title}</h3>
                  <p className="text-[#4a403a] text-[16px] md:text-[18px] leading-[1.8] whitespace-pre-wrap">{section.description}</p>
                </motion.div>
              );
            }

            return (
              <motion.div 
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
                key={index} 
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-[24px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.1)] border-4 border-white aspect-[4/3]">
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="inline-block px-3 py-1 bg-[#f5e6d6] text-[#8c5211] text-[11px] font-bold rounded-full mb-6 tracking-widest">
                    SECTION {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-[28px] md:text-[36px] font-heading font-extrabold text-[#1a1c21] mb-6 leading-[1.2]">
                    {section.title}
                  </h3>
                  <p className="text-[#4a403a] text-[16px] leading-[1.8] whitespace-pre-wrap">
                    {section.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-32 pt-20 border-t border-[#eaddd0] text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold text-[#1a1c21] mb-4">Ready to Create Your Own Story?</h2>
          <p className="text-[#6b5c52] mb-8 font-medium">Book a premium theatre today and celebrate your special moments in cinematic style.</p>
          <Link to="/cities" className="inline-block px-10 py-4 bg-[#1a1c21] text-white rounded-full font-bold hover:bg-[#8c5211] transition-colors shadow-lg">
            Book Your Theatre
          </Link>
        </div>

      </div>
    </div>
  );
}
