'use client';

import { motion } from 'framer-motion';
import { Bell, FileText, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Assessment Generated Successfully',
      description: 'Your recent request for "Physics Mid-Term" was completed.',
      time: '2 minutes ago',
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100',
    },
    {
      id: 2,
      type: 'info',
      title: 'New Feature Available',
      description: 'You can now export your generated papers directly to PDF!',
      time: '1 hour ago',
      icon: Bell,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      id: 3,
      type: 'document',
      title: 'Assignment Due Reminder',
      description: 'The "Math Basics" assignment is due tomorrow for Class 5th.',
      time: '5 hours ago',
      icon: FileText,
      color: 'text-orange-500',
      bg: 'bg-orange-100',
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto w-full pt-4 pb-12 px-4"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Stay updated on your assignment activities.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, index) => {
          const Icon = notif.icon;
          return (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full ${notif.bg} flex items-center justify-center shrink-0`}>
                <Icon className={notif.color} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-[15px]">{notif.title}</h3>
                  <span className="text-xs font-semibold text-gray-400">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{notif.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
