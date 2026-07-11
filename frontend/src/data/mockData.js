export const MOCK_VIDEOS = [
  {
    _id: '1',
    title: 'How to learn React | A React Roadmap',
    description: 'Complete React roadmap for beginners and intermediate developers.',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    views: 100000,
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    owner: {
      _id: 'u1',
      fullName: 'Yash Mittal',
      username: 'yashmittal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    duration: 1245,
    likesCount: 4200,
  },
  {
    _id: '2',
    title: 'Cyberpunk UI Design in Figma',
    description: 'Design stunning neon cyberpunk interfaces.',
    thumbnail:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    views: 85000,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    owner: {
      _id: 'u2',
      fullName: 'Neon Studio',
      username: 'neonstudio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    duration: 890,
    likesCount: 3100,
  },
  {
    _id: '3',
    title: 'Building a Video Platform with MERN',
    description: 'Full stack video streaming app tutorial.',
    thumbnail:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    views: 250000,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    owner: {
      _id: 'u1',
      fullName: 'Yash Mittal',
      username: 'yashmittal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    duration: 2100,
    likesCount: 8900,
  },
  {
    _id: '4',
    title: 'Tailwind CSS Advanced Tips',
    description: 'Level up your Tailwind workflow.',
    thumbnail:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    views: 45000,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    owner: {
      _id: 'u3',
      fullName: 'Code Craft',
      username: 'codecraft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    duration: 720,
    likesCount: 1800,
  },
  {
    _id: '5',
    title: 'Framer Motion Animations Masterclass',
    description: 'Create buttery smooth animations in React.',
    thumbnail:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    views: 120000,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    owner: {
      _id: 'u2',
      fullName: 'Neon Studio',
      username: 'neonstudio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    duration: 1560,
    likesCount: 5400,
  },
  {
    _id: '6',
    title: 'Node.js API Best Practices',
    description: 'Production-ready Node.js patterns.',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    views: 67000,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    owner: {
      _id: 'u1',
      fullName: 'Yash Mittal',
      username: 'yashmittal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    duration: 1890,
    likesCount: 2900,
  },
  {
    _id: '7',
    title: 'Zustand State Management Guide',
    description: 'Lightweight state management for React.',
    thumbnail:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    views: 33000,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    owner: {
      _id: 'u3',
      fullName: 'Code Craft',
      username: 'codecraft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    duration: 980,
    likesCount: 1200,
  },
  {
    _id: '8',
    title: 'Deploying React Apps to Production',
    description: 'CI/CD and deployment strategies.',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop',
    videoFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    views: 91000,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    owner: {
      _id: 'u2',
      fullName: 'Neon Studio',
      username: 'neonstudio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    duration: 1340,
    likesCount: 4100,
  },
]

export const MOCK_CHANNEL = {
  _id: 'u1',
  fullName: 'Yash Mittal',
  username: 'yashmittal',
  email: 'yash@vidtube.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  coverImage: null,
  subscribersCount: 600000,
  subscribedToCount: 220,
  isSubscribed: false,
  videos: MOCK_VIDEOS.filter((v) => v.owner.username === 'yashmittal'),
}

export const MOCK_COMMENTS = [
  {
    _id: 'c1',
    content: 'This is exactly what I needed! Great tutorial 🔥',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    owner: {
      fullName: 'Alex Dev',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop',
    },
  },
  {
    _id: 'c2',
    content: 'The cyberpunk UI looks insane. Subscribed!',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    owner: {
      fullName: 'Sarah Code',
      username: 'sarahcode',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    },
  },
  {
    _id: 'c3',
    content: 'Can you make a part 2 about advanced hooks?',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    owner: {
      fullName: 'Mike React',
      username: 'mikereact',
      avatar: 'https://images.unsplash.com/photo-1599566150163-2fa14c9d1b1e?w=50&h=50&fit=crop',
    },
  },
]
