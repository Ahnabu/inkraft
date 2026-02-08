import { initBotId } from 'botid/client/core';

// Define the paths that need bot protection.
// These are critical API endpoints and server actions that require protection
// from automated bots, scrapers, and malicious traffic.

initBotId({
  protect: [
    // Contact Form - Prevent spam submissions
    {
      path: '/api/contact',
      method: 'POST',
    },

    // User Registration - Prevent fake account creation
    {
      path: '/api/register',
      method: 'POST',
    },

    // Post Creation - Prevent automated content spam
    {
      path: '/api/posts',
      method: 'POST',
    },

    // Post Updates - Protect post editing
    {
      path: '/api/posts/*',
      method: 'PUT',
    },

    // Comment System - Prevent comment spam
    {
      path: '/api/comments/*',
      method: 'POST',
    },
    {
      path: '/api/comments/*',
      method: 'PUT',
    },
    {
      path: '/api/comments/*',
      method: 'DELETE',
    },

    // Voting System - Prevent vote manipulation
    {
      path: '/api/posts/*/vote',
      method: 'POST',
    },

    // Save/Bookmark - Prevent spam bookmarking
    {
      path: '/api/posts/*/save',
      method: 'POST',
    },

    // Image Uploads - Prevent abuse of upload system
    {
      path: '/api/upload',
      method: 'POST',
    },

    // Admin Routes - Protect admin actions
    {
      path: '/api/admin/*',
      method: 'POST',
    },
    {
      path: '/api/admin/*',
      method: 'PUT',
    },
    {
      path: '/api/admin/*',
      method: 'DELETE',
    },

    // User Profile Updates
    {
      path: '/api/user/*',
      method: 'PUT',
    },
  ],
});
