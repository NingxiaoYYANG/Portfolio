import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { getProjects } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import ProjectsToolbar from '../components/ProjectsToolbar';
import ProjectModal from '../components/ProjectModal';
import { useRecruiterMode } from '../contexts/RecruiterModeContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const { recruiterMode } = useRecruiterMode();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        // getProjects() returns axios response.data, which is { success: true, data: [...] }
        // So we need to access response.data to get the array
        const projectsData = response?.data || [];
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback: use hardcoded projects if API fails
        const fallbackProjects = [
          {
            id: 1,
            title: 'CourseMaper (COMP3900)',
            subtitle: "Bloom's Taxonomy Analytics Platform",
            category: 'Web',
            year: '2024',
            cover: '/CourseMapper/CourseMapper_homepage.png',
            coverType: 'image',
            description: "Web app that analyses course outlines and exam questions using Bloom's Taxonomy. Delivered with a 3–6 person team using TDD, CI/CD, and client feedback loops.",
            techTags: ['React', 'Flask', 'Python', 'BERT'],
            highlightTags: ['TDD', 'CI/CD', 'Team Lead'],
            technologies: ['React', 'Flask', 'Python', 'BERT', 'TDD', 'CI/CD'],
            codeUrl: 'https://github.com/NingxiaoYYANG/COMP3900_course_outline_mapping',
            demoUrl: '',
            caseStudyUrl: '/CourseMapper/Final Report.pdf',
            screenshots: [
              '/CourseMapper/CourseMapper_Outlines.png',
              '/CourseMapper/CourseMapper_Outcome.png',
            ],
            featured: true,
          },
          {
            id: 2,
            title: 'SkillVerse (Web3 & AI Hackathon)',
            subtitle: 'Decentralised Certification Platform',
            category: 'Hackathon',
            year: '2023',
            cover: '/SkillVerse/TitlePage.png',
            coverType: 'image',
            description: 'AI-powered decentralised certification platform with NFT credentials. Built and demoed under tight deadline, awarded Aspiring Entrepreneur and Best Presentation.',
            techTags: ['React', 'Solidity', 'IPFS', 'OpenAI API'],
            highlightTags: ['Web3', 'NFT', 'Hackathon Winner'],
            technologies: ['React', 'Solidity', 'IPFS', 'OpenAI API', 'Web3'],
            codeUrl: 'https://github.com/NingxiaoYYANG/Skillverse',
            demoUrl: '',
            caseStudyUrl: '/SkillVerse/SkillVerse Demo Video.mp4',
            screenshots: [
              '/SkillVerse/Selection.png',
              '/SkillVerse/SkillTree.png',
              '/SkillVerse/CollectNFT.png',
              '/SkillVerse/CompleteAll.png',
              '/SkillVerse/Loading.png',
              '/SkillVerse/award.jpg',
            ],
            featured: true,
          },
          {
            id: 3,
            title: 'MistWalker (NetEase KK GameDev Contest)',
            subtitle: 'Cooperative Survival Game',
            category: 'Game',
            year: '2024',
            cover: '/MistWalker/mistwalker.jpg',
            coverType: 'image',
            description: 'Top-down cooperative survival game built in Y3 Editor. Implemented core systems including movement, damage, UI, buffs, and item/unit mechanics under contest constraints.',
            techTags: ['Y3 Editor', 'GameDev'],
            highlightTags: ['Gameplay Systems', 'UI Systems'],
            technologies: ['GameDev', 'Y3 Editor', 'UI', 'Gameplay Systems'],
            codeUrl: 'https://github.com/NingxiaoYYANG/MistWalker.git',
            demoUrl: '',
            caseStudyUrl: '/MistWalker/mistwalker.mp4',
            screenshots: [
              '/MistWalker/ingame.png',
              '/MistWalker/Awards.jpg',
            ],
            featured: true,
          },
          {
            id: 4,
            title: 'Event Management Platform (Contract)',
            subtitle: 'ACSA Event Platform',
            category: 'Web',
            year: '2023-2024',
            cover: '/AACSI/TitlePage.png',
            coverType: 'image',
            description: 'React + Flask + SQL platform with authentication and admin/user workflows. Deployed on GoDaddy hosting and supported stability during production handover.',
            techTags: ['React', 'Flask', 'SQL'],
            highlightTags: ['Auth Systems', 'Production Deployment'],
            technologies: ['React', 'Flask', 'SQL', 'Auth', 'GoDaddy Hosting'],
            codeUrl: 'https://github.com/NingxiaoYYANG/AACSI_Project',
            demoUrl: 'https://aacsi.org.au/',
            caseStudyUrl: '',
            screenshots: [
              '/AACSI/EventsPage.png',
              '/AACSI/ProfilePage.png',
              '/AACSI/SignUpPage.png',
            ],
            featured: true,
          },
          {
            id: 5,
            title: 'Production Website (Contract)',
            subtitle: 'Jo-en Media Website',
            category: 'Web',
            year: '2024',
            cover: '/JoEnMedia/HomePage.png',
            coverType: 'image',
            description: 'Production website built with React + Flask and containerised with Docker. Delivered enquiry-to-email workflow and deployed to production with client handover.',
            techTags: ['React', 'Flask', 'Docker'],
            highlightTags: ['Docker', 'Production Deployment'],
            technologies: ['React', 'Flask', 'Docker', 'Deployment', 'REST APIs'],
            codeUrl: 'https://github.com/NingxiaoYYANG/Jo-enmedia',
            demoUrl: 'https://jo-enmedia.com',
            caseStudyUrl: '/JoEnMedia/joen_demo.mp4',
            featured: true,
          },
        ];
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    // Recruiter Mode: only show featured projects
    if (recruiterMode) {
      filtered = filtered.filter((p) => p.featured === true);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.techTags?.some((tag) => tag.toLowerCase().includes(query)) ||
          p.highlightTags?.some((tag) => tag.toLowerCase().includes(query)) ||
          p.technologies?.some((tech) => tech.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'featured') {
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    } else if (sortBy === 'most-recent') {
      filtered.sort((a, b) => {
        const yearA = parseInt(a.year?.split('-')[0] || '0');
        const yearB = parseInt(b.year?.split('-')[0] || '0');
        return yearB - yearA;
      });
    }

    return filtered;
  }, [projects, recruiterMode, selectedCategory, sortBy, searchQuery]);

  // Set default sort based on Recruiter Mode
  useEffect(() => {
    if (recruiterMode && sortBy !== 'featured') {
      setSortBy('featured');
    }
  }, [recruiterMode]);

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-4 text-gradient">Projects</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-3xl">
          A small selection of work that I'm proud of.
        </p>

        {/* Toolbar */}
        {!loading && projects.length > 0 && (
          <ProjectsToolbar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              {searchQuery || selectedCategory !== 'All'
                ? 'No projects match your filters.'
                : "No projects found yet. Once you add a few highlights, they'll show up here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onCardClick={setSelectedProject}
              />
            ))}
          </div>
        )}

        {/* Project Detail Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </motion.div>
    </div>
  );
}
