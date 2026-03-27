import { motion } from 'framer-motion'
import { Sparkles, Users, Search, Lightbulb } from 'lucide-react'

interface LandingPageProps {
  onStart: (path: 'intake' | 'expert' | 'discover' | 'propose') => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <motion.header 
        className="px-8 py-8 border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Studyond GPS</h1>
          <p className="text-gray-600 mt-2 text-lg">Find your thesis path with confidence</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div 
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-semibold leading-tight mb-6 max-w-4xl text-gray-900"
              variants={itemVariants}
            >
              Navigate your thesis journey with intelligent guidance
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl"
              variants={itemVariants}
            >
              Whether you're searching for a topic, connecting with experts, or refining your direction—we help you move forward with clarity.
            </motion.p>
          </motion.div>

          {/* Action Cards */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* AI Find Topic */}
            <motion.button
              onClick={() => onStart('intake')}
              className="group relative bg-blue-50 border border-blue-200 rounded-lg p-8 text-left hover:border-blue-400 hover:bg-blue-100 transition-colors duration-300"
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              custom={0}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div variants={cardHoverVariants} className="w-full h-full">
                <div className="inline-block mb-4 p-3 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors duration-300">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Let AI Find Your Topic</h3>
                <p className="text-gray-600 text-lg">Get personalized topic suggestions based on your skills and interests.</p>
              </motion.div>
            </motion.button>

            {/* Find Experts */}
            <motion.button
              onClick={() => onStart('expert')}
              className="group relative bg-purple-50 border border-purple-200 rounded-lg p-8 text-left hover:border-purple-400 hover:bg-purple-100 transition-colors duration-300"
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              custom={1}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div variants={cardHoverVariants} className="w-full h-full">
                <div className="inline-block mb-4 p-3 bg-purple-200 rounded-lg group-hover:bg-purple-300 transition-colors duration-300">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Find Experts for Interviews</h3>
                <p className="text-gray-600 text-lg">Connect with industry professionals for expert interviews and insights.</p>
              </motion.div>
            </motion.button>

            {/* Discover Topics */}
            <motion.button
              onClick={() => onStart('discover')}
              className="group relative bg-green-50 border border-green-200 rounded-lg p-8 text-left hover:border-green-400 hover:bg-green-100 transition-colors duration-300"
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              custom={2}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div variants={cardHoverVariants} className="w-full h-full">
                <div className="inline-block mb-4 p-3 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors duration-300">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Discover Topics for Your Thesis</h3>
                <p className="text-gray-600 text-lg">Find thesis topics from university institutes and industry experts.</p>
              </motion.div>
            </motion.button>

            {/* Propose Topic */}
            <motion.button
              onClick={() => onStart('propose')}
              className="group relative bg-orange-50 border border-orange-200 rounded-lg p-8 text-left hover:border-orange-400 hover:bg-orange-100 transition-colors duration-300"
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              custom={3}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div variants={cardHoverVariants} className="w-full h-full">
                <div className="inline-block mb-4 p-3 bg-orange-200 rounded-lg group-hover:bg-orange-300 transition-colors duration-300">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">Propose Your Own Topic</h3>
                <p className="text-gray-600 text-lg">Find industry partners open for your topic proposal.</p>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-gray-500 text-lg">Choose a path above to begin your thesis journey</p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
