import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
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
        <div className="mb-16 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-[#c2a290]"></div>
            <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">
              FEATURED STORY
            </span>
          </div>
          
          <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-6">
            {story.title}
          </h1>

          {story.shortDescription && (
            <p className="text-[18px] md:text-[22px] font-medium text-[#6b5c52] leading-[1.6] mb-8">
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
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-16 md:space-y-24">
          
          {(!story.sections || story.sections.length === 0) && story.content && (
            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-p:text-[#4a403a] prose-p:leading-[1.8] break-words">
              <p className="whitespace-pre-wrap break-words">{story.content}</p>
            </div>
          )}

          {story?.sections && story.sections.length > 0 && story.sections.map((section, index) => {
            if (!section) return null;
            const hasImage = !!section.image;

            return (
              <div 
                key={index} 
                className="max-w-3xl mx-auto text-left mb-12"
              >
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1a1c21] mb-4">
                  {index + 1}. {section.title || 'Untitled Section'}
                </h3>
                <p className="text-[#4a403a] text-[16px] md:text-[18px] leading-[1.8] whitespace-pre-wrap break-words mb-8">
                  {section.description || ''}
                </p>
                
                {hasImage && (
                  <div className="w-full rounded-[24px] overflow-hidden shadow-lg border-4 border-white bg-[#f0e6dd] mt-6 flex justify-center">
                    <img src={getImageUrl(section.image)} alt={section.title || 'Section Image'} onError={handleImageError} className="w-full h-auto max-h-[500px] object-contain" />
                  </div>
                )}
              </div>
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
